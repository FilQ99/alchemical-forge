import React from 'react';
import { GENERATORS, RESOURCES } from '../data/gameData';
import AnimatedNumber from './AnimatedNumber';

const getIconUrl = (iconName) => new URL(`../assets/icons/${iconName}`, import.meta.url).href;

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

function calculateMaxBuy(baseCost, owned, resources) {
    if(!resources) return 0;
    let canBuy = 0;
    let tempResources = { ...resources };
    let currentOwned = owned;
    
    for (let i = 0; i < 1000; i++) { // Limit to 1000 iterations for performance
        const costForOne = calculateCostForN(baseCost, currentOwned, 1);
        const canAffordThisOne = Object.entries(costForOne).every(([res, amount]) => tempResources[res] >= amount);

        if (canAffordThisOne) {
            Object.entries(costForOne).forEach(([res, amount]) => tempResources[res] -= amount);
            canBuy++;
            currentOwned++;
        } else {
            break;
        }
    }
    return canBuy;
}

const GeneratorItem = ({ id, state, dispatch, resources, buyMultiplier, canAfford }) => {
    const data = GENERATORS[id];
    
    let amountToBuy = 1;
    if (typeof buyMultiplier === 'number') {
        amountToBuy = buyMultiplier;
    } else if (buyMultiplier === 'MAX') {
        amountToBuy = calculateMaxBuy(data.baseCost, state.owned, resources);
    }
    
    if (amountToBuy === 0) {
        amountToBuy = 1;
    }
    
    const totalCost = calculateCostForN(data.baseCost, state.owned, amountToBuy);
    const afford = canAfford(totalCost);

    const handleBuy = () => {
        const finalAmountToBuy = (buyMultiplier === 'MAX') ? calculateMaxBuy(data.baseCost, state.owned, resources) : amountToBuy;
        if (afford && finalAmountToBuy > 0) {
            dispatch({ type: 'BUY_GENERATOR', payload: { key: id, multiplier: finalAmountToBuy } });
        }
    };

    return (
        <div className={`upgrade-item ${!afford ? 'disabled' : ''}`} onClick={handleBuy}>
            <img src={getIconUrl(data.icon)} className="icon" alt={data.name} />
            <div className="upgrade-details">
                <span className="upgrade-name">{data.name} (+{amountToBuy})</span>
                <div className="upgrade-cost">
                    {Object.keys(data.baseCost).length > 0 ? (
                        Object.entries(totalCost).map(([res, amount]) => (
                            <div key={res} className="cost-line">
                                <AnimatedNumber value={amount} />
                                <img src={getIconUrl(RESOURCES[res].icon)} className="icon-tiny" alt={RESOURCES[res].name} />
                            </div>
                        ))
                    ) : (
                        <span className="cost-line">Max Poziom</span>
                    )}
                </div>
            </div>
            <div className="upgrade-owned">{state.owned}</div>
        </div>
    );
};

const GeneratorsPanel = ({ generators, dispatch, resources, buyMultiplier, canAfford }) => (
    <div className="panel">
        {Object.entries(generators).map(([key, state]) => (
            <GeneratorItem
                key={key}
                id={key}
                state={state}
                dispatch={dispatch}
                resources={resources}
                buyMultiplier={buyMultiplier}
                canAfford={canAfford}
            />
        ))}
    </div>
);

export default GeneratorsPanel;