import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {

  const [socket, setSocket] = useState<Socket>(null as any);

  useEffect(() => {
    const socket = io();
    
    socket.on('a', () => {
        console.log('a');
    });

    socket.on('b', () => {
        console.log('b');
    });

    socket.on('c', () => {
        console.log('c');
    });

    socket.emit('join', { hehe:'heha' });

    setSocket(socket);
  }, []);

  const join = () => socket.emit('join');

  return (
    <div className={styles.container}>
        <div>
            {socket?.connected ? 'connected' : 'not connected'}
        </div>

      <button onClick={join}>invoke join</button>
    </div>
  )
}

export default Home
