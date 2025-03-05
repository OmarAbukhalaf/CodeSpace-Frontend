import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code, ArrowRight } from "lucide-react";
import socket from "./Socket";
import "./Home.css";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const createRoom = () => {
    socket.emit("createRoom");
  
    socket.once("roomCreated", ({ roomId, passcode }) => {
      console.log(`Room created: ID: ${roomId}, Passcode: ${passcode}`);
  
      sessionStorage.setItem("roomId", roomId);
      sessionStorage.setItem("passcode", passcode);
  
      navigate(`/room`);
    });
  
    socket.on("error", (message) => {
      setError(message);
    });
  };

  const joinRoom = () => {
    if (!roomId || !passcode) {
      setError("Please enter both Room ID and Passcode.");
      return;
    }
  
    setIsJoining(true);
    sessionStorage.setItem("roomId", roomId);
    sessionStorage.setItem("passcode", passcode);
  
    socket.emit("joinRoom", { roomId, passcode });
  
    socket.on("error", (message) => {
      setError(message);
      setIsJoining(false);
    });
  
    socket.on("codeUpdate", () => {
      navigate(`/room`);
    });
  };
  
  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="logo-section">
          <Code size={24} className="logo-icon" />
          <span className="logo-text">CodeSpace</span>
        </div>
      </nav>

      <div className="hero-section">
        <h1>
          Collaborative <span className="highlight">Coding</span> <br />
          Made Simple
        </h1>
        <p className="description">
          Real-time code collaboration. Create or join a room and start coding together instantly.
        </p>

        <div className="action-container">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
          </div>

          <div className="button-group">
            <button 
              className="join-btn" 
              onClick={joinRoom}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Room"}
              <ArrowRight size={20} />
            </button>
            <div className="or-divider">
              <span>OR</span>
            </div>
            <button 
              className="create-btn" 
              onClick={createRoom}
            >
              Create New Room
              <Code size={20} />
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Home;