import React, { useEffect, useState } from 'react';
import socket from '../socket';
import Scoreboard from '../components/Scoreboard';
import JuryPanel from '../components/JuryPanel';

const GameRoom = ({ gameId }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Join the specified game room when component mounts
    socket.emit('joinGameRoom', gameId);

    // Listen for score updates
    socket.on('scoreUpdated', (data) => {
      console.log('Score updated:', data);
      setScores((prevScores) => [...prevScores, data]);
    });

    return () => {
      socket.off('scoreUpdated'); // Clean up listener when unmounting
    };
  }, [gameId]);

  return (
    <div>
      <h1>Game Room {gameId}</h1>
      <Scoreboard scores={scores} />
      <JuryPanel gameId={gameId} />
    </div>
  );
};

export default GameRoom;
