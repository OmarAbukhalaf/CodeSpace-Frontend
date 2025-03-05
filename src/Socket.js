import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Use the same socket connection everywhere

export default socket;
