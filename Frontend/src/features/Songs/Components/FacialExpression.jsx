import { detect, init } from "../utils/utils";
import { useEffect, useRef, useState } from "react";
import { RefreshCw, Smile, Frown, Zap, Meh } from "lucide-react";

export default function FacialExpression({ onGetSongs }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamref = useRef(null);
  const [expression, setExpression] = useState("Neutral");
  const [matchPercent, setMatchPercent] = useState(84);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    init({ landmarkerRef, streamref, videoRef });

    return () => {
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  const handleDetect = () => {
    setIsScanning(true);
    detect({ 
      landmarkerRef, 
      setExpression: (val) => {
        setExpression(val);
        const moodMap = {
          "Happy": "happy",
          "Sad": "sad",
          "Surprised": "surprised",
          "Neutral": "neutral"
        };
        const moodStr = moodMap[val] || "neutral";
        if (onGetSongs) onGetSongs(moodStr);
      }, 
      videoRef 
    });
    setMatchPercent(Math.floor(Math.random() * (95 - 75 + 1) + 75));
    setTimeout(() => setIsScanning(false), 2000);
  };

  const getMoodConfig = () => {
    switch(expression) {
      case "Happy": return { label: "Radiant Joy", icon: Smile, color: "text-amber-500", bg: "bg-amber-50" };
      case "Sad": return { label: "Deep Serenity", icon: Frown, color: "text-indigo-400", bg: "bg-indigo-50" };
      case "Surprised": return { label: "Vibrant Energy", icon: Zap, color: "text-fuchsia-400", bg: "bg-fuchsia-50" };
      case "Neutral": return { label: "Pure Focus", icon: Meh, color: "text-slate-400", bg: "bg-slate-50" };
      default: return { label: "Pure Focus", icon: Meh, color: "text-slate-400", bg: "bg-slate-50" };
    }
  };

  const mood = getMoodConfig();
  const Icon = mood.icon;

  const handleGetSongsFlow = () => {
    const moodMap = {
      "Happy": "happy",
      "Sad": "sad",
      "Surprised": "surprised",
      "Neutral": "neutral"
    };
    const moodStr = moodMap[expression] || "neutral";
    if (onGetSongs) onGetSongs(moodStr);
  };

  return (
    <div className="w-full min-h-[600px] md:min-h-0 md:h-[340px] bg-white/40 backdrop-blur-xl rounded-[32px] md:rounded-[48px] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-16 border border-white/60 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.03)] relative overflow-hidden animate-[slideUp_1s_ease-out]">
      <video ref={videoRef} className="hidden" />

      <div className={`absolute top-0 right-0 w-64 h-64 ${mood.bg} blur-[100px] rounded-full opacity-50 -translate-y-1/2 translate-x-1/2 transition-colors duration-1000 animate-pulse`}></div>
      
      <div className="flex-1 space-y-6 md:space-y-8 relative z-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-3 animate-[slideDown_0.6s_ease-out]">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1A163A] text-white text-[8px] font-black rounded-full tracking-wider shadow-lg shadow-indigo-100 animate-[pulse-glow_2s_infinite]">
            <span className={`w-1 h-1 bg-blue-400 rounded-full ${isScanning ? 'animate-ping' : ''}`}></span>
            REAL-TIME ANALYTICS
          </div>
          <span className="text-[#3B82F6]/60 text-[8px] font-black tracking-[0.2em] uppercase">
            AI VIBE ENGINE
          </span>
        </div>

        <div className="space-y-3 animate-[slideUpFade_0.8s_ease-out_both] delay-[200ms]">
          <h1 className="text-[28px] md:text-[38px] font-black text-[#1A163A] leading-[1.1] tracking-[-0.04em] group">
            Harmonizing your<br className="hidden md:block" />
            <span className="relative inline-block transition-transform duration-500 group-hover:scale-105">current state</span>
          </h1>
          <p className="text-[12px] md:text-[13px] font-semibold text-slate-400 leading-relaxed max-w-md mx-auto md:mx-0">
            Our AI analyzes your expressions to curate a personalized sonic landscape. 
            Currently reflecting <span className={`font-[800] underline decoration-[2px] underline-offset-[6px] cursor-pointer italic px-1 decoration-blue-50/50 transition-colors duration-1000 ${mood.color}`}>{mood.label}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-1">
          <button 
            onClick={handleDetect}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-[#3B82F6] hover:bg-blue-700 text-white rounded-[14px] md:rounded-[16px] font-black text-[11px] md:text-[12px] shadow-lg shadow-blue-100 transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-2.5 cursor-pointer group"
          >
            <RefreshCw strokeWidth={3} className={`w-[14px] h-[14px] md:w-[16px] md:h-[16px] ${isScanning ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-700`} />
            Resync Your Vibe
          </button>
          
          <div className="flex items-center gap-3 group cursor-help" onClick={handleGetSongsFlow}>
            <div className="flex -space-x-1.5">
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#14B8A6] border-[2px] md:border-[3px] border-white shadow-sm ring-1 ring-slate-100/30"></div>
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#60A5FA] border-[2px] md:border-[3px] border-white shadow-sm ring-1 ring-slate-100/30"></div>
            </div>
            <span className="text-[#1A163A]/30 text-[8px] md:text-[9px] font-black tracking-[0.25em] uppercase">{matchPercent}% MATCH</span>
          </div>
        </div>
      </div>

      <div className="relative group shrink-0 animate-[slideInRight_1s_ease-out]">
        <div className={`absolute -inset-10 ${mood.bg} rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-1000 ${isScanning ? 'opacity-80 scale-125' : ''}`}></div>
        
        <div className={`relative w-[180px] h-[210px] md:w-[220px] md:h-[260px] ${mood.bg} rounded-[40px] md:rounded-[56px] overflow-hidden shadow-2xl border-[10px] border-white transition-all duration-[800ms] group-hover:rotate-2 group-hover:scale-[1.05] ring-1 ring-slate-100/50 flex flex-col items-center justify-center`}>
          
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`absolute w-[1px] h-12 bg-white rounded-full animate-[rain_3s_linear_infinite]`} style={{ left: `${i * 20}%`, animationDelay: `${i * 0.5}s`, opacity: isScanning ? 0.8 : 0.4 }}></div>
             ))}
          </div>

          <Icon strokeWidth={2.5} className={`${mood.color} w-[72px] h-[72px] md:w-[90px] md:h-[90px] transition-all duration-700 ${isScanning ? 'scale-125 rotate-12 blur-[1px] animate-pulse' : 'scale-100 rotate-0 blur-0 animate-[float_4s_ease-in-out_infinite]'}`} />
          
          <div className="absolute inset-0 z-10 pointer-events-none">
             <div className={`w-full h-1.5 bg-white/60 blur-[1px] absolute top-0 shadow-[0_0_20px_white] ${isScanning ? 'animate-[scanning-bar_2s_linear_infinite]' : 'translate-y-[-10px] opacity-0'}`}></div>
             <div className={`w-full h-[60px] bg-gradient-to-b from-white/20 to-transparent absolute top-0 ${isScanning ? 'animate-[scanning-bar_2s_linear_infinite]' : 'opacity-0'}`}></div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-white/50 rounded-full blur-[1.5px] shadow-inner opacity-40"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanning-bar {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(260px); opacity: 0; }
        }
        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes rain {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(260px); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(26, 22, 58, 0.4); }
          50% { box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.2); }
        }
      `}} />
    </div>
  );
};
