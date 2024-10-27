import React from 'react';

const Scoreboard = ({ scores }) => {
  return (
    <div>
      <h2>Scoreboard</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            Team {score.teamId} received {score.points} points from Jury {score.juryId} in Round {score.round}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scoreboard;
