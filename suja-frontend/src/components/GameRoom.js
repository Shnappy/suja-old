import React, { useEffect } from 'react';

function GameRoom({ gameRoomId, userRole, teams, currentTeam, setCurrentTeam, socket, handleVote, handleNextTeam }) {
  useEffect(() => {
    if (socket) {
      socket.on('scoreUpdate', (updatedTeams) => {
        setCurrentTeam(updatedTeams.find((team) => team.name === currentTeam.name));
      });
    }

    return () => {
      if (socket) {
        socket.off('scoreUpdate');
      }
    };
  }, [socket, currentTeam, setCurrentTeam]);

  return (
    <div>
      <h2>Game Room: {gameRoomId}</h2>
      <h3>Role: {userRole}</h3>
      {currentTeam && (
        <div>
          <h3>Evaluating Team: {currentTeam.name}</h3>
          <button onClick={() => handleVote(1)}>+1 Point</button>
          <button onClick={() => handleVote(-1)}>-1 Point</button>
        </div>
      )}
      <button onClick={handleNextTeam}>Next Team</button>
      <div>
        <h3>Teams:</h3>
        <ul>
          {teams.map((team) => (
            <li key={team.name}>
              {team.name} - Score: {team.score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GameRoom;
