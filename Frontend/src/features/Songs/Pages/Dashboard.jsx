import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Home, 
  Search, 
  Library, 
  Heart, 
  MoreVertical, 
  Volume2, 
  VolumeX,
  Repeat, 
  Shuffle, 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause,
  LogOut,
  Music2
} from 'lucide-react';
import { useSong } from '../Hooks/useSong';
import FacialExpression from '../Components/FacialExpression';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`group flex items-center gap-4 px-4 py-3 cursor-pointer rounded-[20px] transition-all duration-300 ${active ? 'bg-blue-50 text-[#3B82F6] shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
  >
    <Icon size={22} className={`transition-all duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]' : 'group-hover:scale-110'}`} />
    <span className={`text-[13px] font-black tracking-tight ${active ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>{label}</span>
  </div>
);

const Dashboard = () => {
  const { songs, loading, handleGetSongs: getSongsByMood } = useSong();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const moodCards = [
    { name: "Cheerful", mood: "Happy", label: "Lift your spirit", icon: Smile, color: "from-amber-400/20 to-orange-400/10", iconColor: "text-amber-500" },
    { name: "Mellow", mood: "Neutral", label: "Stay in focus", icon: Meh, color: "from-slate-400/20 to-slate-500/10", iconColor: "text-slate-500" },
    { name: "Dynamic", mood: "Surprised", label: "Fresh energy", icon: Zap, color: "from-fuchsia-400/20 to-pink-500/10", iconColor: "text-fuchsia-500" },
    { name: "Soulful", mood: "Sad", label: "Chill & Deep", icon: Frown, color: "from-indigo-400/20 to-blue-500/10", iconColor: "text-indigo-500" }
  ];

  const handleGetSongs = async (mood) => {
    await getSongsByMood(mood);
    if (songs && songs.length > 0) {
      setCurrentSong(songs[0]);
      setIsPlaying(true);
    }
  };

  const playSong = (song) => {
    if (currentSong?._id === song._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (!songs.length) return;
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    const currentIndex = songs.findIndex(s => s._id === currentSong?._id);
    let nextIndex = (currentIndex + 1) % songs.length;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    }
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePrev = () => {
    if (!songs.length) return;
    const currentIndex = songs.findIndex(s => s._id === currentSong?._id);
    let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Auto-play blocked"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const val = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(val || 0);
      }
    };
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden text-[#1A163A] font-['Inter'] antialiased select-none relative animate-[fadeIn_0.8s_ease-out]">
      <audio 
        ref={audioRef} 
        onEnded={() => {
           if (isRepeat) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
           } else {
              handleNext();
           }
        }}
        src={currentSong?.audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <aside className="hidden md:flex w-[75px] h-screen bg-white/80 backdrop-blur-md shadow-[10px_0_40px_rgba(0,0,0,0.01)] flex-col items-center py-8 gap-10 z-50 border-r border-slate-100/50 flex-shrink-0 animate-[fadeIn_1s_ease-out]">
        <div className="w-[36px] h-[36px] bg-[#3B82F6] rounded-[12px] flex items-center justify-center text-white shadow-md shadow-blue-50 cursor-pointer hover:scale-110 hover:rotate-6 transition-all duration-300 mb-1 group/home">
          <Music2 strokeWidth={3} className="w-[20px] h-[20px] group-hover/home:animate-pulse" />
        </div>
        <nav className="flex flex-col gap-8 flex-1">
          <SidebarItem icon={Home} label="Home" active={activeNav === 'Home'} onClick={() => setActiveNav('Home')} />
        </nav>
      </aside>
      
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="h-[64px] flex items-center justify-between px-6 md:px-10 z-40 flex-shrink-0 bg-[#F9FAFB]/40 backdrop-blur-md border-b border-slate-100/50">
          <div className="flex items-center gap-4 md:gap-12 animate-[slideDown_0.6s_ease-out]">
             <span className="text-[20px] font-black tracking-tighter text-[#1A163A]">MoodSync</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[14px] bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer overflow-hidden">
                <img src="https://i.pravatar.cc/100?u=premium" alt="" className="w-full h-full object-cover" />
             </div>
             <button 
               onClick={handleLogout}
               className="w-9 h-9 sm:w-10 sm:h-10 rounded-[14px] bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer group"
             >
                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
             </button>
          </div>
        </header>
        
        <main className="flex-1 px-6 md:px-10 pt-1 pb-44 md:pb-52 lg:pb-56 overflow-y-auto overflow-x-hidden flex flex-col gap-6 scroll-smooth">
          <FacialExpression onGetSongs={handleGetSongs} />

          <section className="space-y-6 flex-1 flex flex-col min-h-0 pb-4">
            <div className="flex items-end justify-between pr-2 flex-shrink-0">
              <div className="space-y-1">
                <h2 className="text-[20px] md:text-[24px] font-black tracking-tight leading-none">Mood Discovery</h2>
                <p className="text-[10px] md:text-[12px] font-bold text-slate-300 tracking-wide">Soundscapes tailored to you</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-shrink-0">
                {moodCards.map((card, i) => {
                  const MoodIcon = card.icon;
                  return (
                    <button 
                      key={card.name}
                      onClick={() => handleGetSongs(card.name.toLowerCase())}
                      style={{ animationDelay: `${i * 100}ms` }}
                      className={`group relative w-full h-[150px] md:h-[180px] lg:h-[210px] rounded-[24px] md:rounded-[28px] overflow-hidden shadow-sm transition-all duration-700 hover:-translate-y-3 hover:shadow-xl cursor-pointer border border-slate-100 hover:border-[#3B82F6]/30 bg-gradient-to-br ${card.color} flex flex-col items-center justify-center gap-2 md:gap-4 animate-[slideUpFade_0.8s_ease-out_both]`}
                    >
                      <div className={`p-4 md:p-5 rounded-2xl md:rounded-[22px] bg-white shadow-sm transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg ${card.iconColor} animate-[float_4s_ease-in-out_infinite]`} style={{ animationDelay: `${i * 200}ms` }}>
                        <MoodIcon strokeWidth={2.5} className="w-[32px] h-[32px] md:w-[48px] md:h-[48px]" />
                      </div>
                      <div className="text-center">
                         <p className="text-[7px] md:text-[8px] font-black tracking-[0.25em] md:tracking-[0.3em] uppercase opacity-40 mb-0.5">{card.label}</p>
                         <h3 className="text-[14px] md:text-[18px] font-black tracking-tight leading-none text-[#1A163A]/80">{card.mood}</h3>
                      </div>
                    </button>
                  );
                })}
            </div>
            <section className="xl:hidden space-y-6 pt-4 pb-20">
              <div className="flex items-end justify-between pr-2">
                <div className="space-y-1">
                  <h2 className="text-[20px] font-black tracking-tight leading-none">Suggested Songs</h2>
                  <p className="text-[10px] font-bold text-slate-300 tracking-wide">Your current vibe queue</p>
                </div>
              </div>
              <div className="space-y-3">
                {songs.map((song, i) => (
                  <div 
                    key={song._id || i}
                    onClick={() => playSong(song)}
                    style={{ animationDelay: `${i * 80}ms` }}
                    className={`group p-3 rounded-[24px] flex items-center gap-4 transition-all duration-300 cursor-pointer border animate-[slideUpFade_0.8s_ease-out_both] ${currentSong?._id === song._id ? 'bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] border-slate-100 ring-2 ring-blue-50/50 scale-[1.02]' : 'bg-white/50 border-transparent active:bg-white active:scale-[0.98]'}`}
                  >
                    <div className="w-[44px] h-[44px] rounded-[16px] bg-slate-100 overflow-hidden shadow-sm flex-shrink-0 relative">
                       <img src={song.posterUrl} alt="" className="w-full h-full object-cover" />
                       {currentSong?._id === song._id && isPlaying && (
                         <div className="absolute inset-0 bg-gradient-to-t from-blue-600/60 to-transparent flex items-end justify-center pb-2 backdrop-blur-[0.5px]">
                            <div className="flex gap-0.5 items-end h-3">
                               {[1,2,3].map(idx => (
                                 <div 
                                   key={idx} 
                                   className="w-[2px] bg-white rounded-full" 
                                   style={{ 
                                     height: '100%',
                                     animation: `music-bounce ${0.4 + (idx * 0.15)}s ease-in-out infinite`,
                                     animationDelay: `${idx * 0.1}s`
                                   }}
                                 ></div>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className={`font-black text-[12px] truncate tracking-tight mb-0.5 leading-none ${currentSong?._id === song._id ? 'text-[#3B82F6]' : 'text-[#1A163A]'}`}>{song.title}</h4>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] truncate opacity-70">{song.artist || 'Vibe explorer'}</p>
                    </div>
                    {currentSong?._id === song._id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] shadow-[0_0_8px_#3B82F6] animate-pulse mr-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </section>
        </main>
      </div>

      <aside className="w-[340px] h-screen bg-white/80 backdrop-blur-md shadow-[-10px_0_40px_rgba(0,0,0,0.01)] flex flex-col z-40 hidden xl:flex overflow-hidden border-l border-slate-100/50 flex-shrink-0 animate-[fadeIn_1s_ease-out]">
         <div className="p-8 pt-12 pb-4 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-[#3B82F6] tracking-[0.3em] uppercase text-xs">Vibe Queue</p>
               <h2 className="text-[28px] font-black tracking-[-0.04em] leading-none">Suggested Songs</h2>
            </div>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-[14px] transition-all text-slate-300 cursor-pointer"><MoreVertical size={22} /></button>
         </div>
         <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-48 scroll-smooth hide-scrollbar">
            <div className="space-y-4 px-1">
               {songs.map((song, i) => (
                  <div 
                    key={song._id || i}
                    onClick={() => playSong(song)}
                    style={{ animationDelay: `${i * 80}ms` }}
                    className={`group p-4 rounded-[28px] flex items-center gap-5 transition-all duration-500 cursor-pointer border animate-[slideUpFade_0.8s_ease-out_both] ${currentSong?._id === song._id ? 'bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] border-slate-100 ring-2 ring-blue-50/50 scale-[1.02]' : 'bg-transparent border-transparent hover:bg-white/40 hover:border-slate-100/50 active:scale-[0.98]'}`}
                  >
                     <div className="relative w-[52px] h-[52px] rounded-[18px] bg-slate-100 overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                        <img src={song.posterUrl} alt="" className="w-full h-full object-cover" />
                        {currentSong?._id === song._id && isPlaying && (
                           <div className="absolute inset-0 bg-gradient-to-t from-blue-600/60 to-transparent flex items-end justify-center pb-2.5 backdrop-blur-[0.5px]">
                              <div className="flex gap-0.5 items-end h-3">
                                 {[1,2,3,4].map(idx => (
                                   <div 
                                     key={idx} 
                                     className="w-[2.5px] bg-white rounded-full" 
                                     style={{ 
                                       height: '100%',
                                       animation: `music-bounce ${0.4 + (idx * 0.15)}s ease-in-out infinite`,
                                       animationDelay: `${idx * 0.1}s`
                                     }}
                                   ></div>
                                 ))}
                              </div>
                           </div>
                        )}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className={`font-black text-[14px] truncate tracking-tight mb-1 transition-colors duration-300 ${currentSong?._id === song._id ? 'text-[#3B82F6]' : 'text-[#1A163A]'}`}>{song.title}</h4>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] truncate opacity-70 group-hover:opacity-100 transition-opacity">
                          {song.artist || 'Independent Artist'}
                        </p>
                     </div>
                     {currentSong?._id === song._id && (
                        <div className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_12px_#3B82F6] animate-pulse"></div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </aside>

      <footer className="fixed bottom-4 md:bottom-5 left-4 md:left-[90px] right-4 md:right-6 z-[100] pointer-events-none flex justify-center animate-[slideUp_0.8s_ease-out]">
         <div className="w-full max-w-[1240px] h-[72px] md:h-[84px] bg-gradient-to-br from-slate-400/25 to-zinc-600/15 backdrop-blur-[100px] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.25)] border border-white/10 border-t-white/30 flex items-center px-4 md:px-10 gap-3 md:gap-10 rounded-[28px] md:rounded-full pointer-events-auto ring-1 ring-white/5 transition-all duration-700 hover:from-slate-400/35 hover:to-zinc-600/25 group/bar relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/bar:animate-[shine_2s_ease-in-out_infinite] pointer-events-none"></div>

            <div className="flex items-center gap-3 md:gap-5 w-auto md:w-[280px] flex-shrink-0 group">
               <div className={`relative w-[44px] h-[44px] md:w-[60px] md:h-[60px] rounded-full bg-slate-100 overflow-hidden shadow-2xl transition-all duration-1000 ring-2 md:ring-4 ring-white/40 ${isPlaying ? 'scale-110 shadow-[#3B82F6]/30 animate-[spin_10s_linear_infinite]' : 'group-hover:scale-105'}`}>
                  <img src={currentSong?.posterUrl || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10"></div>
               </div>
               <div className="hidden sm:block overflow-hidden">
                  <h3 className="text-[14px] md:text-[15px] font-black text-white truncate drop-shadow-sm">{currentSong?.title || "No song selected"}</h3>
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">{currentSong?.artist || "Pick a vibe"}</p>
               </div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-1.5 md:gap-2 px-4 md:px-0">
               <div className="flex items-center gap-4 md:gap-10">
                  <button 
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`hidden sm:block cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 ${isShuffle ? 'text-[#6366F1] drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'text-white/40 hover:text-white/60'}`}
                  >
                    <Shuffle strokeWidth={isShuffle ? 4 : 3} className={`w-[14px] h-[14px] md:w-[16px] md:h-[16px]`} />
                  </button>
                  <button 
                    onClick={handlePrev}
                    className="text-white/60 hover:text-white cursor-pointer transition-all duration-300 hover:scale-125 hover:-translate-x-1.5 active:scale-90"
                  >
                    <SkipBack fill="currentColor" className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-[42px] h-[42px] md:w-[52px] md:h-[52px] bg-gradient-to-tr from-[#1E1B4B] to-[#4338CA] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(30,27,75,0.4)] hover:shadow-[0_15px_40px_-8px_rgba(67,56,202,0.5)] hover:scale-110 active:scale-95 transition-all duration-500 cursor-pointer group/play relative overflow-hidden ring-1 ring-white/20"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/play:opacity-100 transition-opacity duration-500"></div>
                    {isPlaying ? <Pause fill="white" className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]" /> : <Play fill="white" className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] ml-1" />}
                  </button>
                  <button 
                    onClick={handleNext}
                    className="text-white/60 hover:text-white cursor-pointer transition-all duration-300 hover:scale-125 hover:translate-x-1.5 active:scale-90"
                  >
                    <SkipForward fill="currentColor" className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />
                  </button>
                  <button 
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`hidden sm:block cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 ${isRepeat ? 'text-[#6366F1] drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'text-white/40 hover:text-white/60'}`}
                  >
                    <Repeat strokeWidth={isRepeat ? 4 : 3} className={`w-[14px] h-[14px] md:w-[16px] md:h-[16px]`} />
                  </button>
               </div>
               <div className="w-full max-w-[480px] h-1.5 bg-white/10 rounded-full relative group/seek cursor-pointer overflow-hidden backdrop-blur-md ring-1 ring-white/5">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 w-[280px] justify-end group/vol">
               <button onClick={() => setIsMuted(!isMuted)} className="cursor-pointer transition-transform hover:scale-110">
                  {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white/60" />}
               </button>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={isMuted ? 0 : volume} 
                 onChange={(e) => setVolume(e.target.value)}
                 className="w-24 accent-[#3B82F6] opacity-30 group-hover/vol:opacity-100 transition-opacity cursor-pointer bg-transparent"
               />
            </div>
         </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUpFade {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        @keyframes music-bounce {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      ` }} />
    </div>
  );
};

export default Dashboard;