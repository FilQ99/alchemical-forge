import React from 'react';
import ClickerIcon from '../assets/icons/icon-clicker.svg';

const MainClicker = ({ onClick }) => (
  <div className="clicker-area">
    <button id="click-button" onClick={onClick}>
      <img src={ClickerIcon} className="icon-main-clicker" />
      <span className="clicker-text">Zbierz Esencję</span>
    </button>
  </div>
);
export default MainClicker;