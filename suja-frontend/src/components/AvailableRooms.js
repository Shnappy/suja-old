import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AvailableRooms({ setGameRoomId, setUserRole, setTeams, setCurrentTeam }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch available rooms from the server
    axios.get('http://localhost:5000/api/rooms')
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  const handleJoinRoom = (room) => {
    setGameRoomId(room._id);
    setUserRole('Jury');
    setTeams(room.teams);
    setCurrentTeam(room.teams[0]);
  };

  return (
    <div>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <li key={room._id}>
              {room.name}
              <button onClick={() => handleJoinRoom(room)}>Join Room</button>
            </li>
          ))
        ) : (
          <p>No available rooms. Create one to get started!</p>
        )}
      </ul>
    </div>
  );
}

export default AvailableRooms;
