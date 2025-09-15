import React, { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';

import ResourcePanel from './components/ResourcePanel';
import MainClicker from './components/MainClicker';
import GeneratorsPanel from './components/GeneratorsPanel';
import CraftingPanel from './components/CraftingPanel';
import ResearchPanel from './components/ResearchPanel';
import PrestigePanel from './components/PrestigePanel';
import { RECIPES } from './data/gameData';

import './styles/App.css';

function App() {
  const { state, dispatch, isLoading } = useGameLogic(); // Odbieramy isLoading
  const [activeTab, setActiveTab] = useState('generators');
  const [buyMultiplier, setBuyMultiplier] = useState(1);

  // Jeśli gra się wczytuje, pokaż prosty ekran ładowania
  if (isLoading) {
    return (
      <div className="loading-screen">
        <h1 className="game-title">Wczytywanie Kuźni...</h1>
      </div>
    );
  }

  const canAfford = (cost) => {
    if (!cost || !state.resources) return false;
    return Object.entries(cost).every(([resource, amount]) => state.resources[resource] >= amount);
  };
  
  const hasCraftedFinalItem = state.prestige.points > 0 || state.resources.quintessence > 0;

  return (
    <div className="game-wrapper">
      <ResourcePanel resources={state.resources} />
      
      <div className="column column-main">
        <h1 className="game-title">Alchemiczna Kuźnia</h1>
        <MainClicker onClick={() => dispatch({ type: 'CLICK_ESSENCE' })} />
        {hasCraftedFinalItem && <PrestigePanel state={state} dispatch={dispatch} />}
        <CraftingPanel title="Transmutacja" recipes={Object.entries(RECIPES).filter(([,r]) => r.type === 'transmutation')} dispatch={dispatch} canAfford={canAfford} />
        <CraftingPanel title="Rzemiosło" recipes={Object.entries(RECIPES).filter(([,r]) => r.type === 'crafting' || r.type === 'final')} dispatch={dispatch} canAfford={canAfford} />
      </div>

      <div className="column column-right">
        <div className="tabs">
          <button className={activeTab === 'generators' ? 'active' : ''} onClick={() => setActiveTab('generators')}>Generatory</button>
          <button className={activeTab === 'research' ? 'active' : ''} onClick={() => setActiveTab('research')}>Badania</button>
        </div>
        {activeTab === 'generators' && (
          <>
            <div className="buy-multiplier-panel">
              <button className={buyMultiplier === 1 ? 'active' : ''} onClick={() => setBuyMultiplier(1)}>x1</button>
              <button className={buyMultiplier === 10 ? 'active' : ''} onClick={() => setBuyMultiplier(10)}>x10</button>
              <button className={buyMultiplier === 100 ? 'active' : ''} onClick={() => setBuyMultiplier(100)}>x100</button>
              <button className={buyMultiplier === 'MAX' ? 'active' : ''} onClick={() => setBuyMultiplier('MAX')}>MAX</button>
            </div>
            <GeneratorsPanel 
              generators={state.generators} 
              dispatch={dispatch} 
              resources={state.resources}
              buyMultiplier={buyMultiplier} 
              canAfford={canAfford}
            />
          </>
        )}
        {activeTab === 'research' && <ResearchPanel research={state.research} dispatch={dispatch} canAfford={canAfford} />}
      </div>
    </div>
  );
}

export default App;