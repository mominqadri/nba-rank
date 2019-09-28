import os
import json
import praw
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
FILE_PATH = "players/players.json"
db = MongoClient(os.getenv("DB_URI")).Main
db.posts.create_index("id", unique=True)

reddit = praw.Reddit(client_id=os.getenv("REDDIT_ID"),
                     client_secret=os.getenv("REDDIT_SECRET"),
                     user_agent="script:nba-rank:0.0.1")


def main():
    for post_id in reddit.subreddit("nba").top("week"):
        submission = reddit.submission(post_id)
        submission.comments.replace_more(limit=None)
        id = submission.id
        title = submission.title
        score = submission.score
        comments = []
        for comment in submission.comments.list():
            comments.append({"body": comment.body, "score": comment.score})
        db.posts.insert_one({"id": id, "title": title,
                             "score": score, "comments": comments})


if __name__ == "__main__":
    main()
