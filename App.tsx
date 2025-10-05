import React, { useState, useCallback, useEffect } from 'react';
import { GameState } from './types';
import type { TarotCardData, Spread, SavedReading, DailyCardReading, ReadingData } from './types';
import { TAROT_DECK, SPREADS } from './constants';
import { getSpreadInterpretation, getCardOfTheDayInterpretation } from './services/geminiService';
import ShuffleAnimation from './components/ShuffleAnimation';
import CardSpread from './components/CardSpread';
import SpreadSelection from './components/SpreadSelection';
import ReadingLayout from './components/ReadingLayout';
import ReadingHistory from './components/ReadingHistory';
import ShopModal from './components/ShopModal';
import CardOfTheDay from './components/CardOfTheDay';
import CardGlossary from './components/CardGlossary';
import ShareModal from './components/ShareModal';


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('Tổng quan');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [selectedCardIndices, setSelectedCardIndices] = useState<number[]>([]);
  const [drawnCards, setDrawnCards] = useState<TarotCardData[]>([]);
  const [interpretationSummary, setInterpretationSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isShufflingAnimationPlaying, setIsShufflingAnimationPlaying] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [dailyCard, setDailyCard] = useState<DailyCardReading | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (gameState === GameState.REVEALED && drawnCards.length > 0) {
      // Tải trước hình ảnh của lá bài chính để làm cho việc tạo modal chia sẻ nhanh hơn.
      // Trình duyệt sẽ có khả năng cache hình ảnh này, vì vậy khi người dùng mở
      // modal chia sẻ, việc tải nó lên canvas sẽ nhanh hơn nhiều.
      const preloadImage = new Image();
      preloadImage.src = drawnCards[0].image_url;
    }
  }, [gameState, drawnCards]);

  const handleStartReading = (spread: Spread, theme: string, question: string) => {
    setSelectedSpread(spread);
    setSelectedTheme(theme);
    setUserQuestion(question);
    setError(null);
    setDrawnCards([]);
    setSelectedCardIndices([]);
    setInterpretationSummary('');
    setShuffleKey(0); 
    setIsShufflingAnimationPlaying(false); 
    setGameState(GameState.SHUFFLING);
  };
  
  const handleShuffleComplete = useCallback(() => {
    setGameState(GameState.READY);
  }, []);
  
  const handleShuffleClick = () => {
    setIsShufflingAnimationPlaying(true);
    setShuffleKey(prevKey => prevKey + 1);
  };

  const handleAnimationFinish = useCallback(() => {
      setIsShufflingAnimationPlaying(false);
  }, []);

  const getReadingInterpretation = async (indices: number[]) => {
    if (isLoading || !selectedSpread) return;
    
    setIsLoading(true);
    setGameState(GameState.REVEALING);
    setError(null);

    try {
        const cardsToInterpret = indices.map(index => ({
            name: TAROT_DECK[index],
            isReversed: Math.random() > 0.5,
        }));

        const interpretation = await getSpreadInterpretation(cardsToInterpret, selectedSpread, selectedTheme, userQuestion);
        setDrawnCards(interpretation.cards);
        setInterpretationSummary(interpretation.summary);

        const newReading: SavedReading = {
          id: Date.now(),
          date: new Date().toLocaleString('vi-VN'),
          theme: selectedTheme,
          spreadName: selectedSpread.name,
          question: userQuestion,
          cards: interpretation.cards,
          summary: interpretation.summary,
        };
        const existingReadings: SavedReading[] = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
        const updatedReadings = [newReading, ...existingReadings];
        localStorage.setItem('tarotReadings', JSON.stringify(updatedReadings));

        setGameState(GameState.REVEALED);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Đã xảy ra một lỗi không xác định.";
        setError(`Đã xảy ra lỗi: ${errorMessage}. Vui lòng thử lại.`);
        setGameState(GameState.READY); 
    } finally {
        setIsLoading(false);
    }
  }

  const handleDrawCard = async (cardIndex: number) => {
    if (isLoading || !selectedSpread || selectedCardIndices.includes(cardIndex)) return;

    const newSelectedIndices = [...selectedCardIndices, cardIndex];
    setSelectedCardIndices(newSelectedIndices);

    // Chỉ tự động bắt đầu luận giải cho các kiểu trải bài có số lượng lá cố định
    if (selectedSpread.name !== "Tự Do (Freestyle)" && newSelectedIndices.length === selectedSpread.cardCount) {
      await getReadingInterpretation(newSelectedIndices);
    }
  };

  const handleFinalizeReading = async () => {
    if (selectedCardIndices.length > 0) {
      await getReadingInterpretation(selectedCardIndices);
    }
  };

  const handleReset = () => {
    setGameState(GameState.INITIAL);
    setSelectedSpread(null);
    setSelectedCardIndices([]);
    setDrawnCards([]);
    setError(null);
    setInterpretationSummary('');
    setSelectedTheme('Tổng quan');
    setUserQuestion('');
    setShuffleKey(0);
    setIsShufflingAnimationPlaying(false);
    setDailyCard(null);
  }

  const handleShowCardOfTheDay = async () => {
    setIsLoading(true);
    setError(null);
    setGameState(GameState.CARD_OF_THE_DAY); // Chuyển state ngay để hiển thị loading
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
        const storedCardJSON = localStorage.getItem('dailyCardReading');
        if (storedCardJSON) {
            const storedCard: DailyCardReading = JSON.parse(storedCardJSON);
            if (storedCard.date === today) {
                setDailyCard(storedCard);
                setIsLoading(false);
                return;
            }
        }

        const cardIndex = Math.floor(Math.random() * TAROT_DECK.length);
        const cardToInterpret = {
            name: TAROT_DECK[cardIndex],
            isReversed: Math.random() > 0.5,
        };
        
        const result = await getCardOfTheDayInterpretation(cardToInterpret);
        const newDailyReading: DailyCardReading = {
            ...result,
            date: today,
        };
        
        setDailyCard(newDailyReading);
        localStorage.setItem('dailyCardReading', JSON.stringify(newDailyReading));

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định.";
        setError(`Không thể lấy Lá Bài Của Ngày: ${errorMessage}`);
        setGameState(GameState.INITIAL); // Quay về trang chính nếu lỗi
    } finally {
        setIsLoading(false);
    }
  };

  const handleShowGlossary = () => setGameState(GameState.GLOSSARY);
  
  const renderGameState = () => {
    switch (gameState) {
      case GameState.INITIAL:
        return <SpreadSelection 
          onSelectSpread={handleStartReading} 
          onShowHistory={() => setGameState(GameState.HISTORY)} 
          onShowGlossary={handleShowGlossary}
          onShowCardOfTheDay={handleShowCardOfTheDay}
        />;
      case GameState.SHUFFLING:
        return (
            <div className="text-center flex flex-col items-center justify-center w-full max-w-2xl animate-fade-in">
                <h2 className="text-2xl text-slate-300 mb-4 font-bold uppercase tracking-widest">Xáo trộn bộ bài</h2>
                <p className="text-amber-300/80 mb-8 max-w-md">
                    Hãy tập trung vào câu hỏi của bạn. Nhấn nút "Xáo Bài" bao nhiêu lần tùy thích cho đến khi bạn cảm thấy bộ bài đã sẵn sàng.
                </p>
                <div className="h-72 mb-8 flex items-center justify-center relative w-48">
                    <ShuffleAnimation 
                        key={shuffleKey}
                        onAnimationFinish={handleAnimationFinish} 
                    />
                </div>
                <div className="flex items-center gap-4 h-14">
                    <button
                        onClick={handleShuffleClick}
                        disabled={isShufflingAnimationPlaying}
                        className="px-8 py-3 bg-slate-700 text-amber-300 font-bold rounded-lg shadow-lg hover:bg-slate-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isShufflingAnimationPlaying ? 'Đang xáo...' : 'Xáo Bài'}
                    </button>
                    <button
                        onClick={handleShuffleComplete}
                        disabled={isShufflingAnimationPlaying || shuffleKey === 0}
                        className="px-8 py-3 bg-amber-500 text-gray-900 font-bold rounded-lg shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Tiếp Tục
                    </button>
                </div>
            </div>
        );
      case GameState.READY:
         const cardsRemaining = selectedSpread ? selectedSpread.cardCount - selectedCardIndices.length : 0;
         const isFreestyle = selectedSpread?.name === "Tự Do (Freestyle)";
         return (
            <div className="text-center flex flex-col items-center w-full animate-fade-in">
                 <div className="h-28 flex flex-col items-center justify-center mb-4">
                    <h2 className="text-2xl text-slate-300 mb-2 font-bold uppercase tracking-widest">Bộ bài đã sẵn sàng.</h2>
                     <p className="text-amber-300/80 text-lg">
                       {isFreestyle
                           ? `Đã chọn ${selectedCardIndices.length} lá. Chọn bao nhiêu tùy thích.`
                           : `Hãy chọn ${cardsRemaining} lá bài ${cardsRemaining > 1 ? 'nữa' : ''} cho lượt giải "${selectedSpread?.name}".`}
                   </p>
                    {isFreestyle && (
                       <button
                           onClick={handleFinalizeReading}
                           disabled={selectedCardIndices.length === 0 || isLoading}
                           className="mt-4 px-8 py-3 bg-amber-500 text-gray-900 font-bold rounded-lg shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                       >
                           {isLoading ? 'Đang tải...' : 'Xem Luận Giải'}
                       </button>
                   )}
                </div>
                 {error && <p className="text-red-400 mb-4 max-w-md">{error}</p>}
                <CardSpread 
                  onCardSelect={handleDrawCard} 
                  selectedIndices={selectedCardIndices}
                />
            </div>
         );
      case GameState.REVEALING:
      case GameState.REVEALED:
        return (
          <div className="text-center flex flex-col items-center w-full max-w-screen-2xl mx-auto animate-fade-in">
            {gameState === GameState.REVEALED && (
              <div className="h-12 mb-4 flex items-center justify-center">
                  <h2 className="text-2xl text-slate-300">{`Lượt giải "${selectedSpread?.name}" của bạn.`}</h2>
              </div>
            )}
             
             <ReadingLayout 
                cards={drawnCards}
                summary={interpretationSummary}
                question={userQuestion}
                isLoading={isLoading}
                onShare={() => setIsShareModalOpen(true)}
             />

             <div className="h-16 mt-8 flex items-center justify-center gap-4">
                {gameState === GameState.REVEALED && (
                    <>
                        <button
                        onClick={handleReset}
                        className="px-8 py-3 bg-amber-500 text-gray-900 font-bold rounded-lg shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all transform hover:scale-105"
                        >
                        Bắt đầu Lượt Giải Mới
                        </button>
                         <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="px-6 py-3 bg-slate-700 text-amber-300 font-bold rounded-lg shadow-lg hover:bg-slate-600 transition-all transform hover:scale-105 flex items-center gap-2"
                            aria-label="Chia sẻ lượt giải"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                            Chia sẻ
                        </button>
                    </>
                )}
             </div>
          </div>
        );
      case GameState.HISTORY:
        return <ReadingHistory onBack={() => setGameState(GameState.INITIAL)} />;
      case GameState.CARD_OF_THE_DAY:
        if (isLoading) {
             return (
                <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg w-full max-w-md h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300 mb-4"></div>
                    <h3 className="text-xl font-bold text-amber-300">Đang rút lá bài của ngày...</h3>
                    <p className="text-slate-400 mt-2">Vũ trụ đang gửi thông điệp đến bạn.</p>
                </div>
            );
        }
        return dailyCard ? <CardOfTheDay reading={dailyCard} onBack={handleReset} /> : null;
      case GameState.GLOSSARY:
        return <CardGlossary onBack={handleReset} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start p-4 overflow-x-hidden relative">
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reading={{
            cards: drawnCards,
            summary: interpretationSummary,
            question: userQuestion,
        }}
       />
      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
      <header className="text-center my-8 w-full relative">
        <h1 className="text-5xl md:text-6xl font-bold text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] font-cinzel">
          Gemini Tarot
        </h1>
        <p className="text-slate-400 mt-2">Hé nhìn tương lai của bạn với một lượt giải bài cổ điển.</p>
        <button 
            onClick={() => setIsShopOpen(true)}
            className="absolute top-0 right-4 md:right-8 p-3 bg-slate-800/50 rounded-full text-amber-300 hover:text-amber-200 hover:bg-slate-700/70 transition-all shadow-md"
            aria-label="Mở cửa hàng"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        </button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center w-full">
        {renderGameState()}
      </main>
      <footer className="text-center text-slate-500 text-sm py-4 mt-8">
        <p>Các diễn giải Tarot được cung cấp bởi Gemini API của Google.</p>
      </footer>
    </div>
  );
};

export default App;