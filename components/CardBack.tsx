
import React from 'react';

const CardBack: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-800 rounded-xl p-2 border-2 border-amber-300/50 flex items-center justify-center">
      <div className="w-full h-full border-2 border-amber-300/50 rounded-lg flex items-center justify-center">
        <div className="w-1/2 h-1/2 flex flex-col items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-300/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 22a10 10 0 1 0-10-10" />
                <path d="M2 12a10 10 0 1 0 10 10" />
                <path d="M22 12a10 10 0 1 0-10-10" />
            </svg>
        </div>
      </div>
    </div>
  );
};

export default CardBack;
