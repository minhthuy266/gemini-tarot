import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { ReadingData } from '../types';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    reading: ReadingData;
}

// Helper function to wrap text on a canvas
const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineCount = 0;
    // Increased max lines to better accommodate the summary
    const maxLines = 8; 

    for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            if (lineCount + 1 >= maxLines) {
                // Add ellipsis if we exceed max lines
                line = line.trim() + '...';
                context.fillText(line, x, y);
                return;
            }
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            lineCount++;
        } else {
            line = testLine;
        }
    }
    context.fillText(line.trim(), x, y);
};


const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, reading }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [canShare, setCanShare] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Tham khảo các vì sao...');
    
    useEffect(() => {
       // Check for Web Share API support on component mount
       if (navigator.share) {
           setCanShare(true);
       }
    }, []);

    // Effect to cycle through loading messages for better UX
    useEffect(() => {
        if (!isGenerating) return;

        const messages = [
            'Tham khảo các vì sao...',
            'Đang tải hình ảnh các lá bài...',
            'Vẽ nên định mệnh của bạn...',
            'Sắp xong rồi!'
        ];
        let messageIndex = 0;
        const intervalId = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            setLoadingMessage(messages[messageIndex]);
        }, 1500);

        return () => clearInterval(intervalId);
    }, [isGenerating]);


    const generateImage = useCallback(async () => {
        if (!reading || reading.cards.length === 0) {
             setError("Không có dữ liệu lượt giải để tạo ảnh.");
             return;
        }
        setIsGenerating(true);
        setError(null);
        setImageUrl(null);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) {
            setError("Không thể khởi tạo canvas.");
            setIsGenerating(false);
            return;
        }
        
        try {
            await document.fonts.ready;
        } catch (e) {
            console.warn('Custom fonts did not load in time for canvas generation.', e);
        }

        canvas.width = 1200;
        canvas.height = 630;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0c0a1a');
        gradient.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const mainCard = reading.cards[0];
        const otherCards = reading.cards.slice(1, 5); // Show up to 4 other cards
        
        const imagesToLoad = [mainCard, ...otherCards];
        
        const loadImage = (cardData: typeof mainCard): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Could not load image for ${cardData.name}`));
                img.src = cardData.image_url;
            });
        };

        try {
            const loadedImages = await Promise.all(imagesToLoad.map(loadImage));
            const mainCardImage = loadedImages[0];
            const otherCardImages = loadedImages.slice(1);

            // Draw Main Card
            ctx.shadowColor = 'rgba(252, 211, 77, 0.7)';
            ctx.shadowBlur = 30;
            const cardX = 60;
            const cardY = (canvas.height - 420) / 2;
            if (mainCard.isReversed) {
                 ctx.save();
                 ctx.translate(cardX + 150, cardY + 210);
                 ctx.rotate(Math.PI);
                 ctx.drawImage(mainCardImage, -150, -210, 300, 420);
                 ctx.restore();
            } else {
                ctx.drawImage(mainCardImage, cardX, cardY, 300, 420);
            }
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            
            // Draw Text Content
            const textX = 420;
            let currentY = 80;

            ctx.font = 'bold 44px "Playfair Display", serif';
            ctx.fillStyle = '#fcd34d';
            ctx.fillText("Lượt Giải Gemini Tarot", textX, currentY);
            currentY += 60;

            if (reading.question) {
                ctx.font = 'italic 26px "Roboto", sans-serif';
                ctx.fillStyle = '#e5e7eb';
                wrapText(ctx, `Hỏi: "${reading.question}"`, textX, currentY, 750, 36);
                currentY += 80;
            } else {
                 currentY += 20;
            }
            
            ctx.font = 'bold 30px "Playfair Display", serif';
            ctx.fillStyle = '#fef08a';
            ctx.fillText("Tóm Tắt", textX, currentY);
            currentY += 45;

            ctx.font = '24px "Roboto", sans-serif';
            ctx.fillStyle = '#d1d5db';
            wrapText(ctx, reading.summary, textX, currentY, 750, 36);
            
            // Draw other card thumbnails
            if (otherCardImages.length > 0) {
                let thumbX = textX;
                const thumbY = canvas.height - 130;
                const thumbW = 60;
                const thumbH = 84;
                otherCardImages.forEach((thumbImg, index) => {
                    const thumbData = otherCards[index];
                    if (thumbData.isReversed) {
                        ctx.save();
                        ctx.translate(thumbX + thumbW / 2, thumbY + thumbH / 2);
                        ctx.rotate(Math.PI);
                        ctx.drawImage(thumbImg, -thumbW / 2, -thumbH / 2, thumbW, thumbH);
                        ctx.restore();
                    } else {
                        ctx.drawImage(thumbImg, thumbX, thumbY, thumbW, thumbH);
                    }
                    thumbX += thumbW + 15;
                });
            }

            ctx.font = '18px "Roboto", sans-serif';
            ctx.fillStyle = '#6b7280';
            ctx.textAlign = 'right';
            ctx.fillText("Được tạo bởi Gemini Tarot", canvas.width - 40, canvas.height - 40);

            setImageUrl(canvas.toDataURL('image/png'));

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định khi tải ảnh.";
            setError(`Không thể tạo ảnh: ${errorMessage}`);
        } finally {
            setIsGenerating(false);
        }

    }, [reading]);

    useEffect(() => {
        if (isOpen && reading.cards.length > 0 && !imageUrl && !isGenerating) {
            generateImage();
        }
    }, [isOpen, reading, imageUrl, generateImage, isGenerating]);
    
    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'gemini-tarot-reading.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (!imageUrl || !navigator.share) return;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'gemini-tarot-reading.png', { type: 'image/png' });

             if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Lượt Giải Tarot Của Tôi',
                    text: 'Hãy xem lượt giải bài tarot của tôi từ Gemini Tarot!',
                });
             } else {
                 alert("Trình duyệt của bạn không hỗ trợ chia sẻ tệp tin.");
             }
        } catch (err) {
            console.error('Lỗi khi chia sẻ:', err);
            alert('Đã xảy ra lỗi khi cố gắng chia sẻ hình ảnh.');
        }
    };


    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
             <canvas ref={canvasRef} className="hidden"></canvas>
            <div 
                className="bg-slate-900 border-2 border-amber-400/50 rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col relative animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-amber-400/20 text-center relative">
                    <h2 className="text-2xl font-bold text-amber-300 font-cinzel">Chia sẻ Lượt Giải</h2>
                     <button 
                        onClick={onClose}
                        className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 hover:text-white transition-colors z-10 p-2"
                        aria-label="Đóng"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <div className="p-6 flex-grow flex flex-col items-center justify-center">
                    {isGenerating && (
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-300 mb-4"></div>
                            <h3 className="text-xl font-bold text-amber-300">Đang tạo ảnh chia sẻ...</h3>
                            <p className="text-slate-400 mt-2 h-6">{loadingMessage}</p>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    {imageUrl && (
                        <div className="w-full flex flex-col items-center animate-fade-in">
                            <p className="text-slate-300 mb-4 text-center">Đây là hình ảnh tóm tắt lượt giải của bạn.</p>
                             <img src={imageUrl} alt="Xem trước lượt giải Tarot" className="w-full max-w-md rounded-lg shadow-lg border border-slate-700" />
                             <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                                <button
                                    onClick={handleDownload}
                                    className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-500 transition-colors flex items-center gap-2"
                                >
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Tải ảnh
                                </button>
                                {canShare && (
                                     <button
                                        onClick={handleShare}
                                        className="px-6 py-2 bg-slate-700 text-amber-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                                    >
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                        </svg>
                                        Chia sẻ
                                    </button>
                                )}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;