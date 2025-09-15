import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RESOURCES } from '../data/gameData';
import AnimatedNumber from './AnimatedNumber';

// Funkcja pomocnicza do ładowania obrazków w Vite
const getIconUrl = (iconName) => {
  return new URL(`../assets/icons/${iconName}`, import.meta.url).href;
};

const CraftingItem = ({ recipeKey, recipe, dispatch, canAfford }) => {
  const afford = canAfford(recipe.cost);

  // Ta funkcja wyśle akcję do reducera
  const handleCraft = () => {
    if (afford) {
      dispatch({ type: 'CRAFT_RECIPE', payload: { key: recipeKey } });
    }
  };

  return (
    <motion.div
      // Atrybut data-id pozwala na celowanie w ten konkretny element za pomocą CSS
      data-id={recipeKey}
      className={`craft-item ${!afford ? 'disabled' : ''}`}
      onClick={handleCraft}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="craft-result">
        <span>{recipe.name}</span>
      </div>
      <div className="craft-cost">
        {Object.entries(recipe.cost).map(([res, amount]) => (
          <div key={res} className="cost-item">
            <span><AnimatedNumber value={amount} /></span>
            <img src={getIconUrl(RESOURCES[res].icon)} className="icon-small" alt={RESOURCES[res].name} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const CraftingPanel = ({ title, recipes, dispatch, canAfford }) => {
  if (recipes.length === 0) return null;
  return (
    <div className="panel">
      <h2>{title}</h2>
      <AnimatePresence>
        {recipes.map(([key, recipe]) => (
          <CraftingItem 
            key={key} 
            recipeKey={key} 
            recipe={recipe} 
            dispatch={dispatch} 
            canAfford={canAfford} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CraftingPanel;