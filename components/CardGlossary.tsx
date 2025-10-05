import React, { useState, useMemo } from 'react';
import { TAROT_DECK } from '../constants';
import type { CardInterpretation } from '../types';
import { getCardDetails } from '../services/geminiService';
import TarotCard from './TarotCard';

const getImageUrlForCard = (cardName: string): string => {
  const baseUrl = "https://www.trustedtarot.com/img/cards/";
  const slug = cardName.toLowerCase().replace(/\s+/g, '-');
  return `${baseUrl}${slug}.png`;
};

interface CardDetailModalProps {
    cardName: string;
    cardDetails: CardInterpretation | null;
    isLoading: boolean;
    error: string | null;
    onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ cardName, cardDetails, isLoading, error, onClose }) => {
    const imageUrl = getImageUrlForCard(cardName);

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-slate-900 border-2 border-amber-400/50 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors z-10"
                    aria-label="Đóng"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="w-full md:w-1/3 p-6 flex flex-col items-center justify-center flex-shrink-0">
                    <img 
                        src={imageUrl} 
                        alt={cardName} 
                        className="w-52 h-auto object-contain rounded-lg shadow-lg shadow-black/60"
                    />
                    <h2 className="text-2xl mt-4 font-bold text-amber-300 text-center font-cinzel">{cardName}</h2>
                </div>
                
                <div className="w-full md:w-2/3 p-6 border-t-2 md:border-t-0 md:border-l-2 border-slate-700 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-300 mb-4"></div>
                            <h3 className="text-lg font-bold text-amber-300">Đang tải ý nghĩa...</h3>
                        </div>
                    )}
                    {error && (
                         <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
                             <p>{error}</p>
                             <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-700 rounded-lg">Đóng</button>
                         </div>
                    )}
                    {cardDetails && (
                        <div className="space-y-4 text-slate-300">
                             <div>
                                <h3 className="text-xl font-bold text-amber-300 mb-2">Mô tả</h3>
                                <p className="leading-relaxed">{cardDetails.description}</p>
                             </div>
                             <div>
                                <h3 className="text-xl font-bold text-amber-300 mb-2">Ý nghĩa Xuôi</h3>
                                <p className="leading-relaxed">{cardDetails.upright_meaning}</p>
                             </div>
                             <div>
                                <h3 className="text-xl font-bold text-amber-300 mb-2">Ý nghĩa Ngược</h3>
                                <p className="leading-relaxed">{cardDetails.reversed_meaning}</p>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


interface CardGlossaryProps {
    onBack: () => void;
}

const CardGlossary: React.FC<CardGlossaryProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCardName, setSelectedCardName] = useState<string | null>(null);
    const [cardDetails, setCardDetails] = useState<CardInterpretation | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const filteredDeck = useMemo(() => 
        TAROT_DECK.filter(card => card.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm]
    );

    const handleCardClick = async (cardName: string) => {
        setSelectedCardName(cardName);
        setIsLoadingDetails(true);
        setDetailError(null);
        setCardDetails(null);
        try {
            const details = await getCardDetails(cardName);
            setCardDetails(details);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Đã xảy ra một lỗi không xác định.";
            setDetailError(errorMessage);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedCardName(null);
        setCardDetails(null);
        setDetailError(null);
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center animate-fade-in">
            <div className="w-full flex justify-between items-center mb-6">
                 <button onClick={onBack} className="px-4 py-2 bg-slate-700 text-amber-300 font-bold rounded-lg shadow-md hover:bg-slate-600 transition-colors">
                    &larr; Quay về Trang chính
                </button>
                <h2 className="text-2xl text-slate-300 font-bold uppercase tracking-widest">Thư Viện Tarot</h2>
                 <div className="w-36"></div>
            </div>

            <input
                type="text"
                placeholder="Tìm kiếm lá bài (ví dụ: The Fool, Ace of Cups...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md p-3 mb-8 bg-slate-800 border-2 border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 w-full max-h-[60vh] overflow-y-auto pr-2">
                {filteredDeck.map(cardName => (
                    <TarotCard 
                        key={cardName} 
                        cardName={cardName} 
                        imageUrl={getImageUrlForCard(cardName)} 
                        onClick={() => handleCardClick(cardName)}
                    />
                ))}
            </div>
            {filteredDeck.length === 0 && (
                <p className="text-slate-400 mt-8">Không tìm thấy lá bài nào.</p>
            )}

            {selectedCardName && (
                <CardDetailModal 
                    cardName={selectedCardName}
                    cardDetails={cardDetails}
                    isLoading={isLoadingDetails}
                    error={detailError}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default CardGlossary;