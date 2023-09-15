import { useContext } from 'react';
import { WebSocketContext } from '../context/WebSocket';

const useSocket = () => {
  return useContext(WebSocketContext);
};

export default useSocket;
