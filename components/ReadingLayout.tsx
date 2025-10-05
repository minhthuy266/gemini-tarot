import React from 'react';
import type { TarotCardData } from '../types';

// To ensure consistency in card details, we'll create a dedicated component.
const CardDetails: React.FC<{ card: TarotCardData; popupPosition?: 'left' | 'right' | 'center' }> = ({ card, popupPosition = 'center' }) => {
    const popupAlignmentClasses = {
        center: 'left-1/2 -translate-x-1/2',
        left: 'right-0', // For cards on the right, popup opens left.
        right: 'left-0', // For cards on the left, popup opens right.
    };

    const arrowAlignmentClasses = {
        center: 'left-1/2 -translate-x-1/2',
        left: 'right-4 left-auto', // Arrow on the right side of popup
        right: 'left-4 right-auto', // Arrow on the left side of popup
    };

    return (
    <div className="mt-2 w-full">
        <h4 className="text-sm sm:text-base font-medium text-slate-300 h-12 flex items-center justify-center text-center">
            {card.name}
            {card.isReversed && <span className="text-amber-300/80 font-normal">&nbsp;(Ngược)</span>}
        </h4>
        <div className="relative group flex justify-center">
            <span
                className="text-xs text-amber-400 hover:underline cursor-pointer"
                aria-haspopup="true"
            >
                Chi tiết
            </span>
             <div 
                className={`absolute bottom-full w-64 sm:w-72 mb-2 p-3 bg-slate-900 border border-amber-400/50 rounded-lg shadow-xl z-50 
                           opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
                           transition-opacity duration-300
                           ${popupAlignmentClasses[popupPosition]}`}
                role="tooltip"
             >
                <p className={`text-sm text-left font-light ${card.isReversed ? 'text-slate-400' : 'text-slate-200'}`}>
                    <strong className="text-amber-300">Xuôi:</strong> {card.upright_meaning}
                </p>
                <p className={`text-sm text-left font-light mt-2 ${card.isReversed ? 'text-slate-200' : 'text-slate-400'}`}>
                    <strong className="text-amber-300">Ngược:</strong> {card.reversed_meaning}
                </p>
                <div className={`absolute bottom-[-8px] w-4 h-4 bg-slate-900 border-b border-r border-amber-400/50 transform rotate-45 ${arrowAlignmentClasses[popupPosition]}`}></div>
            </div>
        </div>
    </div>
    );
};


interface RevealedCardProps {
    card: TarotCardData;
    position: number;
    popupPosition?: 'left' | 'right' | 'center';
    className?: string;
}

// This component now has a uniform size and uses the CardDetails component.
const RevealedCard: React.FC<RevealedCardProps> = ({ card, position, popupPosition, className = '' }) => {
    return (
        <div className={`flex flex-col items-center text-center p-2 bg-slate-800/30 rounded-lg h-full justify-between w-full max-w-xs mx-auto ${className}`}>
            <span className="text-base sm:text-lg font-bold text-amber-300/90 mb-2 h-14 flex items-center justify-center text-center leading-tight">{position}. {card.position_meaning}</span>
            <div className="flex flex-col items-center">
                <img 
                    src={card.image_url} 
                    alt={card.name} 
                    className={`w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 object-cover rounded-md shadow-lg shadow-black/50 transition-transform duration-500 animate-mystical-glow ${card.isReversed ? 'rotate-180' : ''}`} 
                />
            </div>
            <CardDetails card={card} popupPosition={popupPosition}/>
        </div>
    );
};


interface ReadingLayoutProps {
  cards: TarotCardData[];
  summary: string;
  question?: string;
  isLoading: boolean;
  onShare: () => void;
}

const ReadingLayout: React.FC<ReadingLayoutProps> = ({ cards, summary, question, isLoading, onShare }) => {
  if (isLoading && cards.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-slate-800/30 w-full max-w-md h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300 mb-4"></div>
            <h3 className="text-xl font-bold text-amber-300">Đang luận giải các lá bài...</h3>
            <p className="text-slate-400 mt-2">Gemini đang tham khảo các vì sao để đưa ra diễn giải cho bạn. Vui lòng chờ trong giây lát.</p>
        </div>
    );
  }
  
  const cardCount = cards.length;

  const getLayout = () => {
    if (cardCount === 1) {
        return (
            <div className="w-full max-w-xs sm:max-w-sm flex justify-center items-start">
                 <RevealedCard card={cards[0]} position={1} />
            </div>
        )
    }

    if (cardCount === 3) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-sm sm:max-w-4xl">
          {cards.map((card, index) => (
            <RevealedCard key={index} card={card} position={index + 1} />
          ))}
        </div>
      );
    }
    
    // Fallback for other counts
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 w-full max-w-7xl">
             {cards.map((card, index) => (
                <RevealedCard key={index} card={card} position={index + 1} />
            ))}
        </div>
    );
  };

  const getCelticCrossLayout = () => {
    if (cards.length < 10) return null;

    return (
      <>
        {/* MOBILE & TABLET LAYOUT: Single column */}
        <div className="lg:hidden w-full max-w-md mx-auto flex flex-col items-center gap-6">
            <RevealedCard card={cards[4]} position={5} /> {/* Crown */}
            <div className="w-full grid grid-cols-2 gap-4">
                <RevealedCard card={cards[3]} position={4} popupPosition="right" /> {/* Recent Past */}
                <RevealedCard card={cards[5]} position={6} popupPosition="left" /> {/* Near Future */}
            </div>
            {/* Center Cross */}
            <div className="flex flex-col items-center justify-start p-2 bg-slate-800/30 rounded-lg h-full w-full">
                <div className="relative w-40 h-60 sm:w-48 sm:h-72 mb-2 flex-shrink-0">
                    <img src={cards[0].image_url} alt={cards[0].name} className={`absolute inset-0 w-full h-full object-cover rounded-md shadow-md shadow-black/50 animate-mystical-glow ${cards[0].isReversed ? 'rotate-180' : ''}`} />
                    <img src={cards[1].image_url} alt={cards[1].name} className={`absolute inset-0 w-full h-full object-cover rounded-md shadow-md shadow-black/50 rotate-90 animate-mystical-glow ${cards[1].isReversed ? 'rotate-180' : ''}`} />
                </div>
                <div className="flex flex-col items-center w-full">
                    <div className="text-center w-full">
                        <span className="text-base sm:text-lg font-bold text-amber-300/90 leading-tight">1. {cards[0].position_meaning}</span>
                        <CardDetails card={cards[0]} />
                    </div>
                    <div className="w-2/3 border-t border-slate-600 my-2"></div>
                    <div className="text-center w-full">
                        <span className="text-base sm:text-lg font-bold text-amber-300/90 leading-tight">2. {cards[1].position_meaning}</span>
                        <CardDetails card={cards[1]} />
                    </div>
                </div>
            </div>
            <RevealedCard card={cards[2]} position={3} /> {/* Foundation */}
             {/* Staff */}
            <div className="flex flex-col gap-6 w-full mt-4 border-t-2 border-slate-700 pt-6">
                <RevealedCard card={cards[9]} position={10} />
                <RevealedCard card={cards[8]} position={9} />
                <RevealedCard card={cards[7]} position={8} />
                <RevealedCard card={cards[6]} position={7} />
            </div>
        </div>

        {/* DESKTOP LAYOUT: Classic grid */}
        <div className="hidden lg:grid w-full max-w-7xl grid-cols-[2.5fr_1fr] justify-center items-start gap-x-8 lg:gap-x-16">
            {/* Cross */}
            <div className="grid grid-cols-3 grid-rows-3 gap-4 items-center justify-items-center w-full">
                <RevealedCard card={cards[4]} position={5} className="col-start-2 row-start-1" />
                <RevealedCard card={cards[3]} position={4} popupPosition="right" className="col-start-1 row-start-2" />
                
                {/* Center Cross */}
                <div className="col-start-2 row-start-2 flex flex-col items-center justify-start p-2 bg-slate-800/30 rounded-lg h-full w-full">
                    <div className="relative w-48 h-72 mb-2 flex-shrink-0">
                        <img src={cards[0].image_url} alt={cards[0].name} className={`absolute inset-0 w-full h-full object-cover rounded-md shadow-md shadow-black/50 animate-mystical-glow ${cards[0].isReversed ? 'rotate-180' : ''}`} />
                        <img src={cards[1].image_url} alt={cards[1].name} className={`absolute inset-0 w-full h-full object-cover rounded-md shadow-md shadow-black/50 rotate-90 animate-mystical-glow ${cards[1].isReversed ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="flex flex-col items-center w-full">
                        <div className="text-center w-full">
                            <span className="text-base font-bold text-amber-300/90 leading-tight">1. {cards[0].position_meaning}</span>
                            <CardDetails card={cards[0]} />
                        </div>
                        <div className="w-2/3 border-t border-slate-600 my-2"></div>
                        <div className="text-center w-full">
                            <span className="text-base font-bold text-amber-300/90 leading-tight">2. {cards[1].position_meaning}</span>
                            <CardDetails card={cards[1]} />
                        </div>
                    </div>
                </div>

                <RevealedCard card={cards[5]} position={6} className="col-start-3 row-start-2" />
                <RevealedCard card={cards[2]} position={3} className="col-start-2 row-start-3" />
            </div>
            
            {/* Staff */}
            <div className="flex flex-col gap-6 w-full">
                <RevealedCard card={cards[9]} position={10} popupPosition="left" />
                <RevealedCard card={cards[8]} position={9} popupPosition="left" />
                <RevealedCard card={cards[7]} position={8} popupPosition="left" />
                <RevealedCard card={cards[6]} position={7} popupPosition="left" />
            </div>
        </div>
      </>
    );
  }


  return (
    <div className="w-full flex flex-col items-center gap-6">
        {question && (
            <div className="max-w-4xl w-full p-4 bg-slate-800 border border-amber-300/20 rounded-lg">
                <h3 className="text-xl font-bold text-slate-300 mb-2">Câu hỏi của bạn</h3>
                <p className="text-amber-200 text-center text-lg italic">"{question}"</p>
            </div>
        )}
        <div className="max-w-4xl w-full p-4 bg-slate-900/50 border border-amber-300/20 rounded-lg">
            <h3 className="text-xl font-bold text-amber-300 mb-2">Tóm tắt Lượt Giải</h3>
            <p className="text-slate-300 text-center">{summary}</p>
        </div>
        {cardCount === 10 ? getCelticCrossLayout() : getLayout()}
    </div>
  );
};

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
// Ensure the style is only added once
if (!document.getElementById('reading-layout-styles')) {
    style.id = 'reading-layout-styles';
    document.head.appendChild(style);
}

export default ReadingLayout;