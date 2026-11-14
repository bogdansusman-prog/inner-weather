import { useState } from 'react';
import Intro from './features/intro/Intro';
//import Home from './features/home/Home';
import { getToken } from './api/client';
//import { logout } from './api/auth';
import Shell from './features/shell/Shell';

export default function App() {
  // esti logat daca ai un token salvat
  const [loggedIn, setLoggedIn] = useState(() => getToken() !== null);

  if (loggedIn) {
    return (
      <Shell
        
      />
    );
  }

  return <Intro onLoggedIn={() => setLoggedIn(true)} />;
}