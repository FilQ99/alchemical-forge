import { GENERATORS, RECIPES, RESEARCH } from "./data/gameData";

export const initialGameState = {
  resources: { essence: 0, fire: 0, water: 0, earth: 0, air: 0, iron: 0, knowledge: 0, quintessence: 0 },
  generators: Object.keys(GENERATORS).reduce((acc, key) => ({ ...acc, [key]: { owned: 0, cost: GENERATORS[key].baseCost } }), {}),
  research: Object.keys(RESEARCH).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
  prestige: {
    upgrades: { eternalFlame: 0 },
    points: 0,
  },
  stats: {
    totalEssence: 0,
  }
};

function canAfford(resources, cost) {
  if (!cost || Object.keys(cost).length === 0) return false;
  return Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount);
}

function calculateCostForN(baseCost, owned, n) {
    if (n <= 0) return {};
    let totalCost = {};
    let currentOwned = owned;
    for (let i = 0; i < n; i++) {
        const costForOne = Object.fromEntries(
            Object.entries(baseCost).map(([res, amount]) => [res, Math.ceil(amount * Math.pow(1.2, currentOwned))])
        );
        for (const res in costForOne) {
            totalCost[res] = (totalCost[res] || 0) + costForOne[res];
        }
        currentOwned++;
    }
    return totalCost;
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      const newState = JSON.parse(JSON.stringify(state));
      let production = {};
      const essenceMultiplier = 1 + (state.prestige.upgrades.eternalFlame * 0.1);

      for (const genKey in state.generators) {
        const genData = GENERATORS[genKey];
        const genState = state.generators[genKey];
        if (genState.owned > 0) {
          for (const resKey in genData.production) {
            let prodAmount = genData.production[resKey] * genState.owned;
            if (resKey === 'essence') prodAmount *= essenceMultiplier;
            if (genKey === 'drain' && state.research.betterDrains) prodAmount *= 2;
            production[resKey] = (production[resKey] || 0) + prodAmount;
          }
        }
      }

      for (const resKey in production) {
        newState.resources[resKey] += production[resKey];
        if (resKey === 'essence') newState.stats.totalEssence += production[resKey];
      }
      return newState;
    }
    case 'CLICK_ESSENCE': {
      let essenceToAdd = 1;
      if (state.research.empoweredClicks) {
          const totalGenerators = Object.values(state.generators).reduce((sum, gen) => sum + gen.owned, 0);
          essenceToAdd += Math.floor(totalGenerators / 10);
      }
      return {
        ...state,
        resources: { ...state.resources, essence: state.resources.essence + essenceToAdd },
        stats: { ...state.stats, totalEssence: state.stats.totalEssence + essenceToAdd },
      }
    }
    case 'BUY_GENERATOR': {
      const { key, multiplier } = action.payload;
      const genData = GENERATORS[key];
      const genState = state.generators[key];

      const cost = calculateCostForN(genData.baseCost, genState.owned, multiplier);
      
      if (canAfford(state.resources, cost)) {
        const newState = JSON.parse(JSON.stringify(state));
        Object.entries(cost).forEach(([res, amount]) => newState.resources[res] -= amount);
        
        const newGenState = newState.generators[key];
        newGenState.owned += multiplier;
        newGenState.cost = calculateCostForN(genData.baseCost, newGenState.owned, 1);
        
        return newState;
      }
      return state;
    }
    case 'CRAFT_RECIPE': {
        const { key } = action.payload;
        const recipe = RECIPES[key];
        if(key === 'philosophersStone') {
            if(canAfford(state.resources, recipe.cost)){
                const quintessenceGained = Math.floor(Math.log10(state.stats.totalEssence + 1));
                const newPrestigePoints = state.prestige.points + quintessenceGained;
                const newQuintessence = state.resources.quintessence + quintessenceGained;
                return {
                    ...initialGameState,
                    prestige: { ...state.prestige, points: newPrestigePoints },
                    resources: { ...initialGameState.resources, quintessence: newQuintessence }
                }
            }
            return state;
        }

        if (canAfford(state.resources, recipe.cost)) {
            const newState = JSON.parse(JSON.stringify(state));
            Object.entries(recipe.cost).forEach(([res, amount]) => newState.resources[res] -= amount);
            Object.entries(recipe.result).forEach(([res, amount]) => {
                let resultAmount = amount;
                if(recipe.type === 'transmutation' && state.research.efficientTransmutation) resultAmount *= 1.10;
                newState.resources[res] += resultAmount;
            });
            return newState;
        }
        return state;
    }
    case 'RESEARCH': {
      const { key } = action.payload;
      const researchData = RESEARCH[key];
      if (!state.research[key] && canAfford(state.resources, researchData.cost)) {
        const newState = JSON.parse(JSON.stringify(state));
        Object.entries(researchData.cost).forEach(([res, amount]) => newState.resources[res] -= amount);
        newState.research[key] = true;
        return newState;
      }
      return state;
    }
    case 'LOAD_GAME': {
      const savedState = action.payload;
      const mergedState = {
        ...initialGameState,
        ...savedState,
        resources: { ...initialGameState.resources, ...savedState.resources },
        generators: { ...initialGameState.generators, ...savedState.generators },
        research: { ...initialGameState.research, ...savedState.research },
        prestige: { ...initialGameState.prestige, ...savedState.prestige },
        stats: { ...initialGameState.stats, ...savedState.stats },
      };
      for (const key in mergedState.generators) {
        if(GENERATORS[key]) {
           mergedState.generators[key].cost = calculateCostForN(GENERATORS[key].baseCost, mergedState.generators[key].owned, 1);
        }
      }
      return mergedState;
    }
    default:
      return state;
  }
}