import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
FILE_PATH = "scripts/players/players.json"

db = MongoClient(os.getenv("DB_URI")).Main


def main():
    db.players.create_index("id", unique=True)
    for player in players():
        try:
            db.players.insert_one(player)
        except:
            continue


def players():
    with open(FILE_PATH, "r") as json_file:
        data = json.load(json_file)
        for player in data["data"]["players"]:
            if player[2] == 1 or player[-1] == "N":
                team_id = player[5]
                rookie = False
                if team_id == 0:
                    team_id = 1610612750
                    rookie = True
                names = player[1].strip().split(",")
                last_name = names[0].strip()
                if len(names) > 1:
                    first_name = names[1].strip()
                else:
                    first_name = None
                team = get_team(team_id)
                yield {"id": player[0], "first_name": first_name, "last_name": last_name, "team": team, "rookie": rookie}
            else:
                continue


def get_team(team_id):
    with open(FILE_PATH, "r") as json_file:
        data = json.load(json_file)
        for team in data["data"]["teams"]:
            if team[0] == str(team_id):
                return team
    raise Exception(f"Error: no team found with ID: {team_id}")


if __name__ == "__main__":
    main()
