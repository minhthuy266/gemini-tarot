import React, { useMemo } from 'react';
import CardBack from './CardBack';

interface CardSpreadProps {
  onCardSelect: (index: number) => void;
  selectedIndices: number[];
}

const CardSpread: React.FC<CardSpreadProps> = ({ onCardSelect, selectedIndices }) => {
  const cardCount = 78;
  const cardIndices = useMemo(() => Array.from({ length: cardCount }, (_, i) => i), []);

  const cardOrientations = useMemo(() => {
    return Array.from({ length: cardCount }, () => Math.random() > 0.5); // true for reversed
  }, []);

  const cardsPerRow = 39;
  const rows = useMemo(() => [
    cardIndices.slice(0, cardsPerRow),
    cardIndices.slice(cardsPerRow, cardCount),
  ], [cardIndices, cardCount]);

  return (
    <div className="w-full max-w-full lg:max-w-7xl mx-auto flex flex-col items-center gap-4 p-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center h-44">
          {row.map((cardIndex, itemIndex) => {
            const isSelected = selectedIndices.includes(cardIndex);
            const isReversed = cardOrientations[cardIndex];
            // Overlap cards: w-24 (96px). Overlap by 68px to show 28px.
            const overlapClass = itemIndex > 0 ? 'ml-[-68px]' : '';

            return (
              <div
                key={cardIndex}
                onClick={() => !isSelected && onCardSelect(cardIndex)}
                className={`w-24 h-36 transition-all duration-300 ease-in-out
                  ${overlapClass}
                  ${isSelected
                    ? '-translate-y-12 z-40 cursor-default'
                    : 'cursor-pointer hover:-translate-y-6 hover:scale-105 hover:z-50 hover:shadow-lg hover:shadow-amber-400/60'
                  }`}
                style={{
                  zIndex: isSelected ? 40 : itemIndex,
                }}
              >
                <div
                    className={`w-full h-full transition-all duration-300 rounded-lg
                      ${isSelected ? 'shadow-lg shadow-amber-300/60' : ''}`
                    }
                    style={{ transform: isReversed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                     <CardBack />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CardSpread;