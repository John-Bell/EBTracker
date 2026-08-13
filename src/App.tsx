import { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { LogMeal } from './pages/LogMeal';
import { LogHistory } from './pages/LogHistory';

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/settings') return 'settings';
    if (hash === '#/log') return 'log';
    if (hash === '#/history') return 'history';
    return 'dashboard';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/settings') {
        setCurrentRoute('settings');
      } else if (hash === '#/log') {
        setCurrentRoute('log');
      } else if (hash === '#/history') {
        setCurrentRoute('history');
      } else {
        setCurrentRoute('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      {currentRoute === 'settings' ? (
        <Settings />
      ) : currentRoute === 'log' ? (
        <LogMeal />
      ) : currentRoute === 'history' ? (
        <LogHistory />
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;
