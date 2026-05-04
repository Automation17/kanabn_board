// ============================================================
// useSocket.js — Custom hook for Socket.io integration
// This will be fully wired in Step 7 (Real-time Notifications)
// ============================================================

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket(onTaskEvent) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL);

    socketRef.current.on("taskCreated", (task) => onTaskEvent("added", task));
    socketRef.current.on("taskUpdated", (task) => onTaskEvent("moved", task));
    socketRef.current.on("taskDeleted", (task) => onTaskEvent("deleted", task));

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef;
}
