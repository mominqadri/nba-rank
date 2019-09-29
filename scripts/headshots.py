import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup

load_dotenv()
FILE_PATH = "scripts/players/players.json"

db = MongoClient(os.getenv("DB_URI")).Main

for player in db.players.find({}):
    id = player["id"]
    url = f"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/{id}.png"
    db.players.update_one({"id": id}, {"$set": {"headshot": url}})
