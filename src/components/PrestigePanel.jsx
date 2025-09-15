import React from 'react';
import { RESOURCES } from '../data/gameData';

const PrestigePanel = ({ state, dispatch }) => (
    <div className="panel prestige-panel">
        <h2>Transcendencja</h2>
        <div className="resource-item">
            <img src={new URL(`../assets/icons/${RESOURCES.quintessence.icon}`, import.meta.url).href} className="icon"/>
            <span>Kwintesencja:</span>
            <span className="resource-value">{state.resources.quintessence.toLocaleString()}</span>
        </div>
        <p>Wydaj Kwintesencję na permanentne ulepszenia.</p>
        {/* Tutaj w przyszłości dodasz listę ulepszeń prestiżowych */}
    </div>
);

export default PrestigePanel;