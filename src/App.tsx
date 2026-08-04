import { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/settings') return 'settings';
    return 'dashboard';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/settings') {
        setCurrentRoute('settings');
      } else {
        setCurrentRoute('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      {currentRoute === 'settings' ? <Settings /> : <Dashboard />}
    </>
  );
}

export default App;
