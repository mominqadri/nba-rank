import os

from flask import Flask
import mongoengine as mongo
from dotenv import load_dotenv as dotenv

dotenv()

mongo.connect('Main', host=os.getenv("DB_URI"))
app = Flask(__name__)


@app.route("/")
def root():
    return {"message": "Hello World!"}


class Player(mongo.Document):
    id = mongo.IntField(required=True)
    first_name = mongo.StringField(required=False)
    last_name = mongo.StringField(required=True)
    team = mongo.ListField()
    mentions = mongo.ListField()
    meta = {"indexes": [{"fields": ["id"], "unique": True}]}


if __name__ == '__main__':
    app.debug = True
    app.run(port=8000)
