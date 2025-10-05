import React, { useState, useEffect } from 'react';
import type { SavedReading } from '../types';
import ReadingLayout from './ReadingLayout';

interface ReadingHistoryProps {
    onBack: () => void;
}

const ReadingHistory: React.FC<ReadingHistoryProps> = ({ onBack }) => {
    const [readings, setReadings] = useState<SavedReading[]>([]);
    const [selectedReading, setSelectedReading] = useState<SavedReading | null>(null);
    const [note, setNote] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    useEffect(() => {
        const storedReadings = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
        setReadings(storedReadings);
    }, []);

    useEffect(() => {
        setNote(selectedReading?.notes || '');
    }, [selectedReading]);

    const handleDelete = (readingId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lượt giải này không?')) {
            const updatedReadings = readings.filter(r => r.id !== readingId);
            setReadings(updatedReadings);
            localStorage.setItem('tarotReadings', JSON.stringify(updatedReadings));
            if (selectedReading?.id === readingId) {
                setSelectedReading(null);
            }
        }
    };

    const handleSaveNote = () => {
        if (!selectedReading) return;
        const updatedReadings = readings.map(r =>
            r.id === selectedReading.id ? { ...r, notes: note } : r
        );
        setReadings(updatedReadings);
        localStorage.setItem('tarotReadings', JSON.stringify(updatedReadings));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    if (selectedReading) {
        return (
            <div className="w-full max-w-screen-2xl mx-auto flex flex-col items-center animate-fade-in">
                <div className="w-full flex justify-between items-center mb-6 px-4">
                     <button
                        onClick={() => setSelectedReading(null)}
                        className="px-4 py-2 bg-slate-700 text-amber-300 font-bold rounded-lg shadow-md hover:bg-slate-600 transition-colors"
                    >
                        &larr; Quay lại Lịch sử
                    </button>
                    <h2 className="text-xl text-slate-300 text-center">
                        Lượt giải ngày {selectedReading.date}
                    </h2>
                     <button
                        onClick={() => handleDelete(selectedReading.id)}
                        className="px-4 py-2 bg-red-800/80 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                    >
                        Xóa
                    </button>
                </div>
                <ReadingLayout 
                    cards={selectedReading.cards}
                    summary={selectedReading.summary}
                    question={selectedReading.question}
                    isLoading={false}
                    // FIX: Pass a no-op function for the required `onShare` prop as sharing from history is not implemented.
                    onShare={() => {}}
                />
                <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h3 className="text-xl font-bold text-amber-300 mb-4">Nhật ký Cá nhân</h3>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ghi lại những suy nghĩ, cảm xúc hoặc sự kiện liên quan đến lượt giải bài này..."
                        className="w-full p-3 bg-slate-900/70 border-2 border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                        rows={5}
                    />
                    <div className="mt-4 flex items-center gap-4">
                        <button
                            onClick={handleSaveNote}
                            className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-500 transition-colors"
                        >
                            Lưu Ghi Chú
                        </button>
                        {showSuccess && <p className="text-green-400">Đã lưu thành công!</p>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto text-center animate-fade-in">
             <div className="flex justify-between items-center mb-8">
                 <button onClick={onBack} className="px-4 py-2 bg-slate-700 text-amber-300 font-bold rounded-lg shadow-md hover:bg-slate-600 transition-colors">
                    &larr; Quay về Trang chính
                </button>
                <h2 className="text-2xl text-slate-300 font-bold uppercase tracking-widest">Lịch Sử Lượt Giải</h2>
                <div className="w-[185px]"></div>
             </div>
           
            {readings.length === 0 ? (
                <p className="text-slate-400 mt-12">Chưa có lượt giải nào được lưu.</p>
            ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {readings.map(reading => (
                        <div key={reading.id} className="p-4 bg-slate-800/50 rounded-lg border-2 border-slate-700 flex justify-between items-center gap-4">
                           <div className="text-left flex-grow">
                                <p className="font-bold text-amber-300 text-lg">{reading.spreadName} - <span className="italic font-normal">{reading.theme}</span></p>
                                {reading.question && <p className="text-slate-400 text-sm italic mt-1 truncate">"{reading.question}"</p>}
                                <p className="text-slate-500 text-xs mt-1">{reading.date}</p>
                           </div>
                           <div className="flex items-center gap-4 flex-shrink-0">
                             {reading.notes && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300/50" viewBox="0 0 20 20" fill="currentColor">
                                    {/* FIX: Replaced the invalid `title` attribute with a nested `<title>` element for accessibility and to fix the TypeScript error. */}
                                    <title>Lượt giải này có ghi chú</title>
                                    <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 00-2-2H9z" />
                                    <path d="M4 5a2 2 0 012-2h1a1 1 0 010 2H6a1 1 0 00-1 1v1a1 1 0 11-2 0V5z" />
                                </svg>
                             )}
                             <button
                                onClick={() => setSelectedReading(reading)}
                                className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-500 transition-colors"
                             >
                                Xem
                             </button>
                             <button
                                onClick={() => handleDelete(reading.id)}
                                className="px-3 py-2 bg-slate-700 text-red-400 hover:bg-slate-600 hover:text-red-300 rounded-lg transition-colors"
                                aria-label={`Xóa lượt giải ngày ${reading.date}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                             </button>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReadingHistory;