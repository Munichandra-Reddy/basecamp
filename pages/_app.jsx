import React from 'react';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { WorkspaceProvider } from '../context/WorkspaceContext';
import { SocketProvider } from '../context/SocketContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <SocketProvider>
          <Component {...pageProps} />
        </SocketProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
