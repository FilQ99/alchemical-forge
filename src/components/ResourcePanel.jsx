import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RESOURCES } from '../data/gameData';
import AnimatedNumber from './AnimatedNumber';

// POPRAWKA: Funkcja pomocnicza do ładowania obrazków w Vite
const getIconUrl = (iconName) => {
  return new URL(`../assets/icons/${iconName}`, import.meta.url).href;
};

const ResourcePanel = ({ resources }) => {
  const ownedResources = Object.entries(resources).filter(([, amount]) => amount > 0.01); // Pokaż, jeśli mamy chociaż odrobinę

  return (
    <div className="column column-left">
      <div className="panel">
        <h2>Zasoby</h2>
        <AnimatePresence>
          {ownedResources.length > 0 ? ownedResources.map(([key, amount]) => (
            <motion.div
              key={key}
              className="resource-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <img src={getIconUrl(RESOURCES[key].icon)} className="icon" alt={RESOURCES[key].name} />
              <span>{RESOURCES[key].name}:</span>
              <span className="resource-value"><AnimatedNumber value={amount} /></span>
            </motion.div>
          )) : (
            <p className="empty-text">Zbierz swoją pierwszą Esencję...</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResourcePanel;