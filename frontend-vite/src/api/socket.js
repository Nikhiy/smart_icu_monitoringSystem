import { io } from "socket.io-client";

const backendHost = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:5000`;
const socket = io(backendHost);

socket.on("connect", () => {
  console.log(`✅ Connected to backend: ${backendHost}`);
});

export default socket;