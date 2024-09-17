const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT;

const app = express();
app.use(cors());
mongoose.connect(DB_URI, {
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const playerSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  team: [],
  aliases: [String],
  mentions: [],
  rookie: Boolean
});

const Player = mongoose.model("player", playerSchema, "players");

app.get("/players", (req, res) => {
  let { limit = 20, offset = 0 } = req.query;
  limit = parseInt(limit);
  offset = parseInt(offset);
  if (limit > 50) limit = 50;

  Player.find({})
    .select("-mentions")
    .limit(limit)
    .skip(limit * offset)
    .sort({ num_mentions: -1 })
    .exec((err, players) => {
      if (err) {
        return res.status(400).send({
          error: { status: 400, message: err.message }
        });
      }
      res.send({ players, limit, offset });
    });
});

app.get("/players/:id", (req, res) => {
  const id = req.params.id;
  Player.findOne({ id }).exec((err, player) => {
    if (err) {
      return res.status(400).send({
        error: { status: 400, message: err.message }
      });
    }
    res.send(player);
  });
});

app.get("/autocomplete", (req, res) => {
  Player.find({}, "id first_name last_name").exec((err, players) => {
    if (err) {
      return res.status(400).send({
        error: { status: 400, message: err.message }
      });
    }
    res.send(players);
  });
});

app.listen(PORT, () => console.log(`nba-rank listening on port ${PORT}...`));
