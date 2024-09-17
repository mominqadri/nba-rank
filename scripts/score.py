import os
import json
import math
import praw
from tqdm import tqdm
from nltk import tokenize
from pymongo import MongoClient
from dotenv import load_dotenv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

load_dotenv()

db = MongoClient(os.getenv("DB_URI")).Main
players = {player["id"]: player for player in db.players.find({})}


def main():
    for id, player in tqdm(players.items()):
        first_name = player["first_name"]
        last_name = player["last_name"]
        num_mentions = len(player.get("mentions")
                           ) if player.get("mentions") else 0
        sentiment = calculate_sentiment(player.get("mentions"))
        polarity = calculate_polarity(player.get("mentions"))
        db.players.update_one({"id": id}, {
                              "$set": {"num_mentions": num_mentions, "sentiment_score": sentiment, "polarity_score": polarity}})


def calculate_sentiment(mentions):
    if mentions is None or len(mentions) == 0:
        return 0
    max_ = max([abs(mention["upvotes"]) for mention in mentions])
    sum = 0
    length = 0
    for mention in mentions:
        upvotes = mention["upvotes"]
        sentiment = mention["sentiment"]
        if -0.4 < sentiment < 0.5:
            continue
        if sentiment > 0:
            sentiment = math.pow(sentiment, 2)
        else:
            sentiment = -math.pow(-sentiment, 1/2)
        sum += sentiment * normalize(upvotes, max_, len(mentions))
        length += 1
    if length == 0:
        return 0
    return sum/length


def calculate_polarity(mentions):
    if mentions is None or len(mentions) == 0:
        return 0
    good = [mention["sentiment"]
            for mention in mentions if mention["sentiment"] > 0.5]
    bad = [mention["sentiment"]
           for mention in mentions if mention["sentiment"] < -0.5]
    p = len(good)/len(mentions)
    c = -len(bad)/len(mentions)
    return ((p-c)/(p+c))*((p+c)/2) if -p != c else p


def normalize(x, max, length):
    xp = abs(x)
    if max == 0:
        return 1/length
    normalized = math.pow(xp/max, 1/16)
    return normalized


if __name__ == "__main__":
    main()
