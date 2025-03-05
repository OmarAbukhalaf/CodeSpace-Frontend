import { io } from "socket.io-client";

const socket = io("https://codespace-backend-production.up.railway.app"); 

export default socket;
