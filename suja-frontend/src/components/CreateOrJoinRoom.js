import React from 'react';

function CreateOrJoinRoom({ handleCreateRoom, availableRoomsComponent }) {
  return (
    <div>
      <h1>Standup Judging App</h1>
      <button onClick={handleCreateRoom}>Create New Room</button>
      {availableRoomsComponent}
    </div>
  );
}

export default CreateOrJoinRoom;
