import React from 'react';
import type { DailyCardReading } from '../types';

interface CardOfTheDayProps {
    reading: DailyCardReading;
    onBack: () => void;
}

const CardOfTheDay: React.FC<CardOfTheDayProps> = ({ reading, onBack }) => {
    return (
        <div className="w-full max-w-screen-md mx-auto flex flex-col items-center animate-fade-in">
             <h2 className="text-3xl font-bold text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] font-cinzel mb-4">
                Lá Bài Của Ngày
            </h2>
             <p className="text-slate-400 mb-8">Đây là thông điệp vũ trụ dành cho bạn hôm nay.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
                <div className="flex flex-col items-center">
                    <img 
                        src={reading.card.image_url} 
                        alt={reading.card.name} 
                        className={`w-64 h-96 object-cover rounded-xl shadow-lg shadow-black/50 animate-mystical-glow ${reading.card.isReversed ? 'rotate-180' : ''}`} 
                    />
                    <h3 className="text-2xl mt-4 font-semibold text-slate-200 text-center">
                        {reading.card.name}
                         {reading.card.isReversed && <span className="text-amber-300/80 font-normal text-xl">&nbsp;(Ngược)</span>}
                    </h3>
                </div>
                <div className="p-6 bg-slate-900/50 border border-amber-300/20 rounded-lg text-left h-full">
                    <h4 className="text-xl font-bold text-amber-300 mb-2">Thông điệp cho bạn</h4>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{reading.interpretation}</p>
                </div>
             </div>

             <button
                onClick={onBack}
                className="mt-12 px-8 py-3 bg-slate-700 text-amber-300 font-bold rounded-lg shadow-lg hover:bg-slate-600 transition-all transform hover:scale-105"
             >
                Quay về Trang chính
             </button>
        </div>
    );
};

// Re-use mystical glow animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes mystical-glow {
        0%, 100% {
            box-shadow: 0 0 8px rgba(252, 211, 77, 0.3), 0 0 12px rgba(252, 211, 77, 0.2);
        }
        50% {
            box-shadow: 0 0 16px rgba(252, 211, 77, 0.5), 0 0 24px rgba(252, 211, 77, 0.3);
        }
    }
    .animate-mystical-glow {
        animation: mystical-glow 5s ease-in-out infinite;
    }
`;
if (!document.getElementById('mystical-glow-styles')) {
    style.id = 'mystical-glow-styles';
    document.head.appendChild(style);
}

export default CardOfTheDay;
