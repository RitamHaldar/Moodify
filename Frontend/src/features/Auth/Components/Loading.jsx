import React from 'react';
import { Music2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center z-[9999] font-['Inter'] antialiased">
      <div className="relative flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border border-blue-100 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full border border-indigo-50 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        
        <div className="relative w-20 h-20 bg-white rounded-[24px] shadow-[0_20px_40px_-5px_rgba(59,130,246,0.15)] flex items-center justify-center animate-[float_3s_ease-in-out_infinite] border border-slate-50">
           <Music2 strokeWidth={3} className="w-[36px] h-[36px] text-[#3B82F6] animate-[pulse_2s_ease-in-out_infinite]" />
        </div>

        <div className="mt-12 text-center space-y-2">
          <h2 className="text-[18px] font-black tracking-tight text-[#1A163A]">
            Finding your rhythm...
          </h2>
          <div className="flex items-center justify-center gap-1.5 opacity-30">
             {[1,2,3].map(i => (
               <div key={i} className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
             ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}} />
    </div>
  );
};

export default Loading;
