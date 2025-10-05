import React from 'react';

interface TarotCardProps {
    cardName: string;
    imageUrl: string;
    className?: string;
    onClick?: () => void;
}

const TarotCard: React.FC<TarotCardProps> = ({ cardName, imageUrl, className, onClick }) => {
    return (
        <div 
            className={`flex flex-col items-center group transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            <img 
                src={imageUrl}
                alt={cardName}
                loading="lazy"
                className="w-full h-auto object-contain rounded-md group-hover:scale-105 transition-transform duration-300 shadow-md shadow-black/40"
            />
            <p className="text-center text-xs mt-2 text-slate-300 group-hover:text-amber-300 transition-colors">{cardName}</p>
        </div>
    );
};

export default TarotCard;
