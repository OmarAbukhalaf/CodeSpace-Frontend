import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Users, Code, LogOut } from "lucide-react";
import socket from "./Socket";
import Editor from "./components/editor.jsx";
import "./Room.css";

function Room() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  const [copiedPasscode, setCopiedPasscode] = useState(false);
  const [userCount, setUserCount] = useState(0);

  const roomId = sessionStorage.getItem("roomId");
  const passcode = sessionStorage.getItem("passcode");

  useEffect(() => {
    if (!roomId || !passcode) {
      console.error("Invalid roomId or passcode");
      navigate("/");
      return;
    }

    socket.emit("joinRoom", { roomId, passcode });

    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("userCountUpdate", (count) => setUserCount(count));

    return () => {
      socket.off("codeUpdate");
      socket.off("userCountUpdate");
    };
  }, [roomId, passcode, navigate]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", newCode);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const copyToClipboard = (text, setStateFn) => {
    navigator.clipboard.writeText(text);
    setStateFn(true);
    setTimeout(() => setStateFn(false), 2000);
  };

  const handleLeaveRoom = () => {
    sessionStorage.removeItem("roomId");
    sessionStorage.removeItem("passcode");
    socket.emit("leaveRoom", { roomId, passcode });
    navigate("/");
  };

  return (
    <div className="codespace-container">
      <div className="top-bar">
        <div className="left-section">
          <div className="logo-section">
            <Code size={20} strokeWidth={2.5} className="logo-icon" />
            <span className="logo-text">CodeSpace</span>
          </div>
          <div className="room-info">
            <div className="room-detail">
              <span className="room-detail-label">Room ID</span>
              <span>{roomId}</span>
              <button 
                className="copy-btn" 
                onClick={() => copyToClipboard(roomId, setCopiedRoomId)}
              >
                {copiedRoomId ? "Copied" : <Copy size={14} />}
              </button>
            </div>
            <div className="room-detail">
              <span className="room-detail-label">Passcode</span>
              <span>{passcode}</span>
              <button 
                className="copy-btn" 
                onClick={() => copyToClipboard(passcode, setCopiedPasscode)}
              >
                {copiedPasscode ? "Copied" : <Copy size={14} />}
              </button>
            </div>
            <div className="room-detail">
              <Users size={14} />
              <span>{userCount}</span>
            </div>
          </div>
        </div>
        <div className="right-section">
          <select 
            className="language-select" 
            value={language} 
            onChange={handleLanguageChange}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
          <button 
            className="leave-btn" 
            onClick={handleLeaveRoom}
          >
            <LogOut size={14} />
            Leave
          </button>
        </div>
      </div>
      <div className="editor-container">
        <Editor 
          key={language}
          code={code} 
          onCodeChange={handleCodeChange} 
          language={language} 
        />
      </div>
    </div>
  );
}

export default Room;
