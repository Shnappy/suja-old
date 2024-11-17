import React, { useEffect, useState } from 'react';

function MainPage({ teams = [], setTeams, socket, handleVote, handleReset, handleAddRound, handleAddTeam }) {
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit('joinGame', (response) => {
        if (response.success) {
          console.log('Successfully joined the game');
          setTeams(response.teams || []);  // Set teams from the server response, or an empty array if undefined
          setRounds(response.rounds || []); // Set rounds from the server response, or an empty array if undefined
        } else {
          console.error('Failed to join the game:', response.message);
        }
      });

      socket.on('scoreUpdate', (updatedTeams) => {
        setTeams(updatedTeams || []); // Ensure teams are always an array
      });

      socket.on('roundAdded', ({ rounds, currentRound }) => {
        setRounds(rounds || []); // Ensure rounds are always an array
        setTeams(currentRound.teams || []); // Ensure currentRound.teams is always an array
      });

      socket.on('gameReset', (resetTeams) => {
        console.log('Game has been reset');
        setTeams(resetTeams || []); // Clear teams on reset
        setRounds([]); // Clear rounds on game reset
      });
    }
  }, [socket, setTeams, setRounds]);

  return (
    <div>
      <h2>Standup Judging Game</h2>
      <button onClick={handleReset}>Reset Game</button>
      <button onClick={handleAddRound}>Add New Round</button>
      <button onClick={handleAddTeam}>Add New Team</button>
      <div>
        <h3>Teams:</h3>
        <ul>
          {teams.map((team) => (
            <li key={team.name}>
              {team.name} - Score: {team.score}
              <button onClick={() => handleVote(team.name, 1)}>+1 Point</button>
              <button onClick={() => handleVote(team.name, -1)}>-1 Point</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Rounds:</h3>
        <ul>
          {rounds.map((round, index) => (
            <li key={index}>
              <strong>Round {index + 1}:</strong>
              <ul>
                {round.teams.map((team) => (
                  <li key={team.name}>{team.name} - Score: {team.score}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MainPage;
