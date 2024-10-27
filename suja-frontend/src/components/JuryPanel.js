import React, { useState } from 'react';
import axios from 'axios';

const JuryPanel = ({ gameId }) => {
  const [teamId, setTeamId] = useState('');
  const [points, setPoints] = useState('');
  const [round, setRound] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/scores', {
        teamId,
        juryId: 'YourJuryId', // Replace with an actual ID or set dynamically
        points: Number(points),
        round: Number(round),
        gameId,
      });
      setTeamId('');
      setPoints('');
      setRound('');
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  return (
    <div>
      <h2>Jury Panel</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Team ID"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <input
          type="number"
          placeholder="Round"
          value={round}
          onChange={(e) => setRound(e.target.value)}
        />
        <button type="submit">Allocate Points</button>
      </form>
    </div>
  );
};

export default JuryPanel;
