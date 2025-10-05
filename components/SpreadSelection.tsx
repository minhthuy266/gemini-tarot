import React, { useState } from 'react';
import { SPREADS } from '../constants';
import type { Spread } from '../types';

interface SpreadSelectionProps {
    onSelectSpread: (spread: Spread, theme: string, question: string) => void;
    onShowHistory: () => void;
    onShowGlossary: () => void;
    onShowCardOfTheDay: () => void;
}

const themes = [
    { key: 'Tổng quan', name: 'Tổng quan', description: 'Một cái nhìn chung về cuộc sống của bạn.' },
    { key: 'Tình yêu', name: 'Tình yêu', description: 'Khám phá các vấn đề về tình cảm và mối quan hệ.' },
    { key: 'Sự nghiệp', name: 'Sự nghiệp', description: 'Nhận định hướng về con đường công việc và sự nghiệp.' },
    { key: 'Tài chính', name: 'Tài chính', description: 'Làm sáng tỏ các vấn đề liên quan đến tiền bạc.' },
];

const SpreadSelection: React.FC<SpreadSelectionProps> = ({ onSelectSpread, onShowHistory, onShowGlossary, onShowCardOfTheDay }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedTheme, setSelectedTheme] = useState<string>('Tổng quan');
    const [question, setQuestion] = useState<string>('');
    const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);

    const handleThemeSelect = (themeKey: string) => {
        setSelectedTheme(themeKey);
        setCurrentStep(2);
    };

    const handleSpreadSelect = (spread: Spread) => {
        setSelectedSpread(spread);
        setCurrentStep(3);
    };
    
    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const animationKey = `step-${currentStep}`;

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            <div aria-hidden="true" className="absolute inset-0 z-0 hidden md:flex justify-center items-center pointer-events-none">
                <div className="relative w-[600px] h-[600px] flex items-center justify-center">
                    <div className="absolute w-full h-full rounded-full border border-amber-400/20 animate-spin-slow"></div>
                    <div className="absolute w-96 h-96 rounded-full border border-amber-400/20 animate-spin-reverse-slow"></div>
                </div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center gap-6 mb-8">
                 <button 
                    onClick={onShowCardOfTheDay}
                    className="w-full max-w-lg p-6 bg-gradient-to-br from-amber-500/80 to-amber-600/80 rounded-xl border-2 border-amber-300/70 shadow-lg shadow-amber-500/20 text-center hover:scale-105 hover:shadow-xl hover:shadow-amber-400/30 transition-all duration-300 group"
                >
                    <h2 className="text-3xl font-bold text-white drop-shadow-md font-cinzel">Lá Bài Của Ngày</h2>
                    <p className="text-amber-100 mt-2 text-lg">Nhận thông điệp vũ trụ dành cho bạn hôm nay &rarr;</p>
                </button>
                
                <div className="flex items-center justify-center gap-8">
                    <button
                        onClick={onShowHistory}
                        className="text-amber-300/70 hover:text-amber-300 font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50"
                    >
                        Lịch Sử Lượt Giải
                    </button>
                    <div className="h-4 w-px bg-slate-600"></div>
                    <button
                        onClick={onShowGlossary}
                        className="text-amber-300/70 hover:text-amber-300 font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50"
                    >
                        Thư Viện Bài
                    </button>
                </div>
                
                <div className="w-full max-w-3xl p-6 bg-slate-800/40 rounded-xl border border-slate-700/80 backdrop-blur-sm">
                    <h2 className="text-2xl text-slate-300 mb-4 font-bold text-center uppercase tracking-widest">Hoặc Bắt Đầu Lượt Giải Mới</h2>
                    <div key={animationKey} className="animate-step-enter">
                         {currentStep === 1 && (
                             <div>
                                <h3 className="text-xl text-center text-slate-300 mb-1 font-bold">Bước 1: Chọn Chủ Đề</h3>
                                <p className="text-amber-300/80 mb-6 text-center">Tập trung lượt giải vào một lĩnh vực cụ thể.</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {themes.map((theme) => (
                                        <button
                                            key={theme.key}
                                            onClick={() => handleThemeSelect(theme.key)}
                                            className="p-4 bg-slate-800/50 rounded-lg border-2 border-slate-700 hover:border-amber-400/50 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col text-center items-center justify-center h-28 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        >
                                            <h3 className="text-lg font-bold text-amber-300">{theme.name}</h3>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="text-center">
                                <h3 className="text-xl text-slate-300 mb-1 font-bold">Bước 2: Chọn Kiểu Trải Bài</h3>
                                <p className="text-amber-300/80 mb-6">Phù hợp với chủ đề <span className="font-bold text-amber-200">{selectedTheme}</span>.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {SPREADS.filter(spread => spread.themes.includes(selectedTheme)).map((spread) => (
                                        <button
                                            key={spread.name}
                                            onClick={() => handleSpreadSelect(spread)}
                                            className="p-6 bg-slate-800/50 rounded-lg border-2 border-slate-700 hover:border-amber-400/50 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        >
                                            <h3 className="text-xl font-bold text-amber-300">{spread.name}</h3>
                                            <p className="text-slate-400 text-sm mb-2">{spread.cardCount} lá bài</p>
                                            <p className="text-slate-300 text-base flex-grow">{spread.description}</p>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={goBack} className="mt-8 text-amber-300/70 hover:text-amber-300 font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50">
                                    &larr; Quay lại
                                </button>
                            </div>
                        )}

                        {currentStep === 3 && selectedSpread && (
                            <div className="text-center">
                                <h3 className="text-xl text-slate-300 mb-1 font-bold">Bước cuối cùng</h3>
                                <p className="text-amber-300/80 mb-6">Lượt giải <span className="font-bold text-amber-200">{selectedSpread.name}</span> cho chủ đề <span className="font-bold text-amber-200">{selectedTheme}</span>.</p>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Đặt câu hỏi (tùy chọn) để có câu trả lời sâu sắc hơn..."
                                    className="w-full max-w-2xl p-3 bg-slate-800 border-2 border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                                    rows={3}
                                />
                                <div className="mt-8 h-14 flex items-center justify-center gap-6">
                                    <button
                                        onClick={() => onSelectSpread(selectedSpread, selectedTheme, question)}
                                        className="px-8 py-3 bg-amber-500 text-gray-900 font-bold rounded-lg shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all transform hover:scale-105"
                                    >
                                        Bắt đầu Lượt Giải
                                    </button>
                                </div>
                                 <button onClick={goBack} className="mt-4 text-amber-300/70 hover:text-amber-300 font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50">
                                    &larr; Quay lại
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const style = document.createElement('style');
style.innerHTML = `
    @keyframes step-enter {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-step-enter {
        animation: step-enter 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }
`;
document.head.appendChild(style);

export default SpreadSelection;