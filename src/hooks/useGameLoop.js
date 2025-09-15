import { useEffect } from 'react';

export const useGameLoop = (tick, interval = 1000) => {
  useEffect(() => {
    const gameInterval = setInterval(tick, interval);
    return () => clearInterval(gameInterval);
  }, [tick, interval]);
};