import React from 'react';
import type { Product } from '../types';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const products: Product[] = [
    {
        id: '1',
        name: 'Bộ Bài Tarot Rider-Waite Smith',
        description: 'Bộ bài tarot cổ điển và phổ biến nhất, lý tưởng cho cả người mới bắt đầu và người đọc bài chuyên nghiệp. Hình ảnh mang tính biểu tượng và dễ hiểu.',
        imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lq4x5n7a2kjm31',
        affiliateLink: 'https://shopee.vn/search?keyword=rider%20waite%20tarot' // Thay thế bằng link affiliate của bạn
    },
    {
        id: '2',
        name: 'Bộ Bài The Wild Unknown Tarot',
        description: 'Khám phá thế giới tự nhiên và vương quốc động vật với bộ bài tuyệt đẹp và đầy nghệ thuật này. Mỗi lá bài là một tác phẩm nghệ thuật.',
        imageUrl: 'https://down-vn.img.susercontent.com/file/sg-11134201-22110-38wuvgmwcvjv1c',
        affiliateLink: 'https://shopee.vn/search?keyword=the%20wild%20unknown%20tarot' // Thay thế bằng link affiliate của bạn
    },
    {
        id: '3',
        name: 'Bộ Bài Light Seer\'s Tarot',
        description: 'Một bộ bài hiện đại, tập trung vào các nhân vật đa dạng và năng lượng ánh sáng. Hoàn hảo cho việc chữa lành và khám phá bản thân.',
        imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lphihrf4fh9re9',
        affiliateLink: 'https://shopee.vn/search?keyword=light%20seer%27s%20tarot' // Thay thế bằng link affiliate của bạn
    },
     {
        id: '4',
        name: 'Bộ Bài Tarot of the Divine',
        description: 'Lấy cảm hứng từ các câu chuyện thần thoại, cổ tích và văn hóa dân gian từ khắp nơi trên thế giới. Một bộ bài đa văn hóa và đầy màu sắc.',
        imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqyt8aj7m9t5da',
        affiliateLink: 'https://shopee.vn/search?keyword=tarot%20of%20the%20divine' // Thay thế bằng link affiliate của bạn
    }
];

const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-slate-900 border-2 border-amber-400/50 rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col relative animate-fade-in"
                onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors z-10"
                    aria-label="Đóng cửa hàng"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <header className="p-4 border-b border-amber-400/20 text-center">
                    <h2 className="text-2xl font-bold text-amber-300 font-cinzel">Cửa Hàng Bài Tarot</h2>
                    <p className="text-slate-400 text-sm">Chọn một bộ bài để bắt đầu hành trình tâm linh của bạn.</p>
                </header>
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-slate-800/50 rounded-lg p-4 flex flex-col md:flex-row gap-4 border border-slate-700">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full md:w-32 h-48 md:h-auto object-cover rounded-md flex-shrink-0" 
                                />
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold text-amber-300">{product.name}</h3>
                                    <p className="text-slate-300 text-sm mt-1 flex-grow">{product.description}</p>
                                    <a 
                                        href={product.affiliateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block text-center w-full md:w-auto px-5 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 transition-colors"
                                    >
                                        Mua trên Shopee
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add fade-in animation to tailwind config (or here in a style tag for simplicity)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fade-in {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
    }
`;
document.head.appendChild(style);


export default ShopModal;