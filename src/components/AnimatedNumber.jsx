import { motion, useSpring, useTransform } from 'framer-motion';
import React from 'react';

// Nowa, profesjonalna funkcja formatująca liczby
const formatNumber = (value) => {
  const number = Math.floor(value);

  if (number < 1000) {
    return number.toLocaleString(); // np. 999
  }
  if (number < 1000000) {
    return (number / 1000).toFixed(2) + ' K'; // np. 1.23 K
  }
  if (number < 1000000000) {
    return (number / 1000000).toFixed(2) + ' M'; // np. 45.67 M
  }
  if (number < 1000000000000) {
    return (number / 1000000000).toFixed(2) + ' B'; // np. 8.90 B
  }
  // Dodaj więcej skrótów (T, q, Q...) w miarę potrzeby
  return (number / 1000000000000).toFixed(2) + ' T';
};

const AnimatedNumber = ({ value }) => {
  // Sprawdzamy, czy wartość jest prawidłową liczbą
  const numericValue = typeof value === 'number' && !isNaN(value) ? value : 0;

  const spring = useSpring(numericValue, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => formatNumber(current));

  // Uaktualnij wartość springa, gdy prop się zmieni
  React.useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  return <motion.span>{display}</motion.span>;
};

export default AnimatedNumber;