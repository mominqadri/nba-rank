import os
import json
import praw
from tqdm import tqdm
from nltk import tokenize
from pymongo import MongoClient
from dotenv import load_dotenv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

load_dotenv()
FILE_PATH = "players/players.json"

db = MongoClient(os.getenv("DB_URI")).Main
players = {player["id"]: player for player in db.players.find({})}

analyzer = SentimentIntensityAnalyzer()


def main():
    for id in players:
        db.players.update_one({"id": id}, {"$unset": {"mentions": []}})
    posts = [post for post in db.posts.find({})]
    max_upvotes = max([comment["score"]
                       for comment in [post for post in posts]])
    min_upvotes = min([comment["score"]
                       for comment in [post for post in posts]])
    for post in tqdm(posts):
        title = post["title"]
        submission_id = post["id"]
        for comment in tqdm(post["comments"]):
            body = comment["body"]
            upvotes = comment["score"]
            for id, mentions in tqdm(get_mentioned_players(comment["body"]).items()):
                for sentence, weight in mentions:
                    sentiment = analyzer.polarity_scores(sentence)["compound"]
                    mention = {"submission_id": submission_id, "title": title, "text": body, "sentence": sentence,
                               "upvotes": upvotes, "sentiment": sentiment}
                    db.players.update_one(
                        {"id": id}, {"$addToSet": {"mentions": mention}})


def score(text, weight, upvotes, max_upvotes, min_upvotes):
    return analyzer.polarity_scores(text)["compound"] * weight * normalize(upvotes, max_upvotes, min_upvotes)


def normalize(x, max, min):
    return (x-min)/(max-min)


def get_mentioned_players(text, players=players):
    mentioned_players = {}
    text = text.split(".")
    for id, player in players.items():
        first_name = player["first_name"].lower(
        ) if player["first_name"] else ""
        last_name = player["last_name"].lower()
        aliases = [alias.lower() for alias in player["aliases"]
                   ] if player.get("aliases") else None
        for sentence in text:
            sentence_raw = sentence
            sentence = sentence.lower()
            if sentence.find(first_name) != -1 and sentence.find(last_name) != -1:
                mentioned_players.setdefault(id, []).append((sentence_raw, 1))
            elif aliases:
                for alias in aliases:
                    if sentence.find(alias) != -1:
                        mentioned_players.setdefault(
                            id, []).append((sentence, 1))
                        continue

    return mentioned_players


if __name__ == "__main__":
    main()
