import React from 'react';
import { RESEARCH, RESOURCES } from '../data/gameData';

const ResearchItem = ({ id, isResearched, canAfford, onResearch, areReqsMet }) => {
    const data = RESEARCH[id];
    const afford = canAfford(data.cost);
    let classes = 'research-item';
    if(isResearched) classes += ' researched';
    if(!afford || !areReqsMet) classes += ' disabled';

    return (
        <div className={classes} onClick={!isResearched && afford && areReqsMet ? onResearch : null}>
            <div className="research-details">
                <span className="research-name">{data.name}</span>
                <span className="research-desc">{data.description}</span>
            </div>
            {!isResearched && (
                 <div className="research-cost">
                    {Object.entries(data.cost).map(([res, amount]) => (
                        <div key={res} className="cost-item">
                            <span>{amount.toLocaleString()}</span>
                            <img src={new URL(`../assets/icons/${RESOURCES[res].icon}`, import.meta.url).href} className="icon-small" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const ResearchPanel = ({ research, dispatch, canAfford }) => (
  <div className="panel">
    <h2>Drzewko Badań</h2>
    {Object.entries(research).map(([key, isResearched]) => {
        const areReqsMet = RESEARCH[key].requires.every(req => research[req]);
        return (
            <ResearchItem
                key={key}
                id={key}
                isResearched={isResearched}
                canAfford={canAfford}
                onResearch={() => dispatch({ type: 'RESEARCH', payload: { key } })}
                areReqsMet={areReqsMet}
            />
        )
    })}
  </div>
);

export default ResearchPanel;