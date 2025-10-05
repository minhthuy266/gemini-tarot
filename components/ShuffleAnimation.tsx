import React, { useState, useEffect } from 'react';
import CardBack from './CardBack';

interface ShuffleAnimationProps {
  onAnimationFinish: () => void;
}

const cardCount = 7;
const animationDuration = 2500; // Giảm thời gian để phản hồi nhanh hơn khi xáo nhiều lần
const stepDuration = animationDuration / (cardCount + 5);

const initialPositions = [
  { transform: 'translate(0px, 0px) rotate(0deg)' },
  { transform: 'translate(0px, 0px) rotate(0deg)' },
  { transform: 'translate(0px, 0px) rotate(0deg)' },
  { transform: 'translate(0px, 0px) rotate(0deg)' },
  { transform: 'translate(0px, 0px) rotate(0deg)' },
  { transform: 'translate(0px, 0px) rotate(0deg)' },
  { transform: 'translate(0px, 0px) rotate(0deg)' },
];

const ShuffleAnimation: React.FC<ShuffleAnimationProps> = ({ onAnimationFinish }) => {
  const [positions, setPositions] = useState(initialPositions);

  useEffect(() => {
    // FIX: Use `ReturnType<typeof setTimeout>` for timeout IDs to ensure browser compatibility,
    // as `NodeJS.Timeout` is not available in browser environments.
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const animate = () => {
      // Step 1: Fan out
      timeouts.push(setTimeout(() => {
        setPositions(Array.from({ length: cardCount }, (_, i) => ({
          transform: `translateX(${(i - Math.floor(cardCount / 2)) * 30}px) rotate(${(i - Math.floor(cardCount / 2)) * 5}deg)`
        })));
      }, stepDuration * 1));

      // Step 2: Shuffle left
      timeouts.push(setTimeout(() => {
        setPositions(Array.from({ length: cardCount }, (_, i) => ({
          transform: `translateX(${i % 2 === 0 ? '-150px' : '150px'}) translateY(${Math.random() * 40 - 20}px) rotate(${Math.random() * 20 - 10}deg)`
        })));
      }, stepDuration * 3));
      
      // Step 3: Shuffle right
      timeouts.push(setTimeout(() => {
        setPositions(Array.from({ length: cardCount }, (_, i) => ({
          transform: `translateX(${i % 2 === 0 ? '150px' : '-150px'}) translateY(${Math.random() * 40 - 20}px) rotate(${Math.random() * 20 - 10}deg)`
        })));
      }, stepDuration * 5));

      // Step 4: Gather
      timeouts.push(setTimeout(() => {
        setPositions(Array.from({ length: cardCount }, () => ({
          transform: 'translate(0px, 0px) rotate(0deg)'
        })));
      }, stepDuration * 7));

      // End
      timeouts.push(setTimeout(onAnimationFinish, animationDuration));
    };

    animate();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onAnimationFinish]);

  return (
    <div className="relative w-48 h-72">
      {positions.map((style, index) => (
        <div
          key={index}
          className="absolute w-full h-full transition-transform duration-500 ease-in-out"
          style={{ ...style, zIndex: index }}
        >
          <CardBack />
        </div>
      ))}
    </div>
  );
};

export default ShuffleAnimation;