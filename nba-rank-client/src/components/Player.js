import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tippy";

export const Player = ({
  id,
  firstName,
  lastName,
  headshot,
  numMentions,
  sentimentScore,
  polarityScore
}) => {
  return (
    <div>
      <Row>
        <Col md={3}>
          <img className="headshot" src={headshot}></img>
        </Col>
        <Col md={5}>
          <div>
            <h1 className="player-name">
              <Link to={`/players/${id}`}>
                {" "}
                {firstName} {lastName}
              </Link>
            </h1>
            <h2>
              {formatNumber(numMentions)} <small>mentions</small>
            </h2>
          </div>
        </Col>
        <Col md={2}>
          <Tooltip
            className="tool-tip"
            followCursor={true}
            title="Sentiment score is a weighted average of the sentiment associated with all mentions of a given player. Comments with a larger number of upvotes matter more."
            position="bottom"
            trigger="mouseenter"
          >
            {" "}
            <span className="score sentiment-score">
              {(sentimentScore * 100).toFixed(1)}
              <span style={{ fontSize: "1.4rem" }}>ss</span>
            </span>
          </Tooltip>
        </Col>
        <Col md={2}>
          <Tooltip
            className="tool-tip"
            followCursor={true}
            title="Polarity score is a function of how controversial the mentions of a player are. Players with more higher polarity mentions (either high upvotes or high downvotes) are more polar."
            position="bottom"
            trigger="mouseenter"
          >
            <p className="score polarity-score">
              {(polarityScore * 100).toFixed(1)}
              <span style={{ fontSize: "1.4rem" }}>ps</span>
            </p>
          </Tooltip>
        </Col>
      </Row>
    </div>
  );
};

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
