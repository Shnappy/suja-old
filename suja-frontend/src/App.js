import React, { useState, useEffect } from 'react';
import AvailableRooms from './components/AvailableRooms';
import CreateOrJoinRoom from './components/CreateOrJoinRoom';
import GameRoom from './components/GameRoom';
import JuryVotingPanel from './components/JuryVotingPanel';
import Scoreboard from './components/Scoreboard';
import socket from './socket';
import axios from 'axios';

function App() {
  const [gameRoomId, setGameRoomId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    const handleRoomLeave = (roomId) => {
      if (!roomId) return;
      socket.emit('leaveRoom', roomId, () => {
        axios.delete(`http://localhost:5000/api/rooms/${roomId}`)
          .then(() => {
            console.log(`Room ${roomId} deleted successfully`);
          })
          .catch((error) => {
            console.error('Error deleting room:', error);
          });
      });
    };

    socket.on('disconnect', () => {
      if (gameRoomId) {
        handleRoomLeave(gameRoomId);
      }
    });

    return () => {
      if (gameRoomId) {
        handleRoomLeave(gameRoomId);
      }
    };
  }, [gameRoomId]);

  const handlePurgeRooms = () => {
    axios.delete('http://localhost:5000/api/rooms')
      .then(() => {
        console.log('All rooms purged successfully');
      })
      .catch((error) => {
        console.error('Error purging rooms:', error);
      });
  };

  const handleCreateRoom = () => {
    const roomName = prompt('Enter room name:');
    const numberOfRounds = prompt('Enter number of rounds:');
    const teamsInput = prompt('Enter team names separated by commas:');
    if (roomName && numberOfRounds && teamsInput) {
      const teamsArray = teamsInput.split(',').map(team => ({ name: team.trim(), score: 0 }));
      axios.post('http://localhost:5000/api/rooms', { name: roomName, teams: teamsArray, totalRounds: parseInt(numberOfRounds) })
        .then(response => {
          console.log('Room created successfully:', response.data);
          setGameRoomId(response.data._id);
          setUserRole('GameMaster');
          setTeams(response.data.teams);
          setCurrentTeam(response.data.teams[0]);
          socket.emit('joinRoom', response.data._id, (joinResponse) => {
            if (joinResponse.success) {
              console.log(`Joined room ${response.data._id} as GameMaster`);
            } else {
              console.error('Error joining room:', joinResponse.message);
            }
          });
        })
        .catch(error => {
          console.error('Error creating room:', error);
        });
    }
  };

  const handleVote = (points) => {
    if (!gameRoomId || !currentTeam) {
      console.error('Cannot vote, no room or team available');
      return;
    }
    socket.emit('voteTeam', { roomId: gameRoomId, teamId: currentTeam.name, points });
  };

  const handleNextTeam = () => {
    if (!teams || teams.length === 0) {
      console.error('No teams available to proceed');
      return;
    }
    const currentIndex = teams.findIndex(team => team.name === currentTeam.name);
    const nextIndex = (currentIndex + 1) % teams.length;
    setCurrentTeam(teams[nextIndex]);
  };

  return (
    <div className="App">
      <button onClick={handlePurgeRooms}>Purge All Rooms</button>
      <CreateOrJoinRoom
        handleCreateRoom={handleCreateRoom}
        availableRoomsComponent={
          <AvailableRooms
            setGameRoomId={setGameRoomId}
            setUserRole={setUserRole}
            setTeams={setTeams}
            setCurrentTeam={setCurrentTeam}
          />
        }
      />
      {gameRoomId && (
        <GameRoom
          gameRoomId={gameRoomId}
          userRole={userRole}
          teams={teams}
          currentTeam={currentTeam}
          setCurrentTeam={setCurrentTeam}
          socket={socket}
          handleVote={handleVote}
          handleNextTeam={handleNextTeam}
        />
      )}
      {teams.length > 0 && <Scoreboard teams={teams} />}
    </div>
  );
}

export default App;