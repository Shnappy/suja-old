import logo from './logo.svg';
import './App.css';
import React from 'react';
import GameRoom from './pages/GameRoom';

function App() {
  return (
    <div className="App">
      <GameRoom gameId="1" /> {/* You can make this dynamic based on the current game */}
    </div>
  );
}

export default App;
