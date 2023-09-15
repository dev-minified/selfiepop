import { API_URL } from 'config';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import io, { Socket } from 'socket.io-client';
const cookies = new Cookies();
const SOCKET_URL = `${API_URL}`;

export interface ISocket {
  socket?: Socket;
}
export const WebSocketContext = createContext<ISocket>({});

const WebSocketProvider: React.FC<{ children?: ReactNode }> = (props) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (!socket) {
      const s = io(SOCKET_URL, {
        withCredentials: true,
        extraHeaders: {
          token: cookies.get('token') || '',
        },
      });

      s.on('connect', () => {
        console.log('connection established', s.connected); // true
      });
      setSocket(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {props.children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
