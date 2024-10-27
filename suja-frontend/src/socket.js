import { io } from 'socket.io-client';

// Establish connection to backend server
const socket = io('http://localhost:5000'); // Adjust URL if hosted elsewhere

export default socket;
