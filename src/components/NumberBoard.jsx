
import React from 'react';
import { motion } from 'framer-motion';

const NumberBoard = ({ selectedNumbers, onNumberToggle, availableNumbers, isAdmin, lockedNumbers = [], soldNumbers = [], purchases = [] }) => {
  // Generate numbers from 00 to 99
  const generateNumbers = () => {
    const numbers = [];
    for (let i = 0; i <= 99; i++) {
      numbers.push(i.toString().padStart(2, '0'));
    }
    return numbers;
  };

  const numbers = generateNumbers();

  const getNumberStatus = (number) => {
    if (soldNumbers.includes(number)) return 'sold';
    if (lockedNumbers.includes(number)) return 'locked';
    if (isAdmin) {
      // In admin, selectedNumbers are the ones available for sale
      return selectedNumbers.includes(number) ? 'available' : 'unavailable';
    } else {
      if (!availableNumbers?.includes(number)) return 'unavailable';
      // In user view, selectedNumbers are the ones in the cart
      return selectedNumbers.includes(number) ? 'selected' : 'available';
    }
  };

  const getNumberStyles = (status) => {
    switch (status) {
      case 'selected':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-lg scale-105';
      case 'available':
        return 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50 hover:scale-105';
      case 'unavailable':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30 cursor-not-allowed opacity-50';
      case 'locked':
        return 'bg-yellow-500/50 text-white border-yellow-400 cursor-not-allowed opacity-70';
      case 'sold':
        return 'bg-purple-600/70 text-white border-purple-400 cursor-not-allowed';
      default:
        return 'bg-white/10 text-white border-white/30';
    }
  };

  const getBuyerName = (number) => {
    const purchase = purchases.find(p => p.status === 'confirmed' && p.numbers.includes(number));
    return purchase ? purchase.userName : null;
  };

  return (
    <div className="grid grid-cols-10 gap-2 max-w-4xl mx-auto">
      {numbers.map((number, index) => {
        const status = getNumberStatus(number);
        const isClickable = isAdmin ? status === 'available' || status === 'unavailable' : status === 'available' || status === 'selected';
        const buyerName = getBuyerName(number);
        
        return (
          <motion.button
            key={number}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01, duration: 0.2 }}
            whileHover={isClickable ? { scale: 1.1 } : {}}
            whileTap={isClickable ? { scale: 0.95 } : {}}
            onClick={() => isClickable && onNumberToggle(number)}
            className={`
              aspect-square flex items-center justify-center rounded-lg border-2 font-bold text-sm
              transition-all duration-200 relative overflow-hidden ${getNumberStyles(status)}
              ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
            `}
            disabled={!isClickable && !isAdmin}
          >
            {buyerName ? (
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-xs leading-tight font-normal">{buyerName}</span>
                <span className="text-lg font-bold">{number}</span>
              </div>
            ) : (
              number
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default NumberBoard;
