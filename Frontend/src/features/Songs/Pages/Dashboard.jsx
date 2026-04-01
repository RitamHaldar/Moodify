import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Home,
  Smile,
  Meh,
  Zap,
  Frown,
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
    className={`group flex items-center gap-4 px-4 py-3.5 cursor-pointer rounded-[24px] transition-all duration-500 relative ${active ? 'bg-gradient-to-tr from-blue-50 to-indigo-50/50 text-[#3B82F6] shadow-[0_10px_20px_-10px_rgba(59,130,246,0.15)] ring-1 ring-blue-100/50' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
  >
    {active && <div className="absolute left-0 w-1 h-6 bg-[#3B82F6] rounded-full -translate-x-2 shadow-[0_0_8px_#3B82F6]"></div>}
    <Icon size={20} strokeWidth={active ? 2.5 : 2} className={`transition-all duration-500 ${active ? 'scale-110 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]' : 'group-hover:scale-110 group-hover:rotate-6'}`} />
    <span className={`text-[12px] font-black tracking-tight transition-all duration-500 ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0'}`}>{label}</span>
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const moodCards = [
    { name: "happy", mood: "Happy", label: "Lift your spirit", icon: Smile, color: "from-amber-400/20 to-orange-400/10", iconColor: "text-amber-500" },
    { name: "neutral", mood: "Neutral", label: "Stay in focus", icon: Meh, color: "from-slate-400/20 to-slate-500/10", iconColor: "text-slate-500" },
    { name: "surprised", mood: "Surprised", label: "Fresh energy", icon: Zap, color: "from-fuchsia-400/20 to-pink-500/10", iconColor: "text-fuchsia-500" },
    { name: "sad", mood: "Sad", label: "Chill & Deep", icon: Frown, color: "from-indigo-400/20 to-blue-500/10", iconColor: "text-indigo-500" }
  ];

  const handleGetSongs = async (mood) => {
    const fetchedSongs = await getSongsByMood(mood);
    if (fetchedSongs && fetchedSongs.length > 0) {
      setCurrentSong(fetchedSongs[0]);
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
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration;
        setCurrentTime(current || 0);
        setDuration(total || 0);
        const val = (current / total) * 100;
        setProgress(val || 0);
      }
    };
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration || 0);
      }
    };
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const percent = x / width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setProgress(percent * 100);
    }
  };

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
        src={currentSong?.songUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <aside className="hidden lg:flex w-[130px] h-screen bg-white/70 backdrop-blur-3xl shadow-[20px_0_60px_rgba(0,0,0,0.01)] flex-col items-center py-12 gap-16 z-50 border-r border-slate-100/50 flex-shrink-0 animate-[fadeIn_1.4s_ease-out] relative">
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-slate-100/80 to-transparent"></div>
        <div className="w-[42px] h-[42px] bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] rounded-[16px] flex items-center justify-center text-white shadow-[0_12px_24px_-8px_rgba(59,130,246,0.5)] cursor-pointer hover:scale-110 hover:rotate-6 transition-all duration-500 mb-2 group/home relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/home:opacity-100 transition-opacity"></div>
          <Music2 strokeWidth={3} className="w-[22px] h-[22px] group-hover/home:animate-pulse relative z-10" />
        </div>
        <nav className="flex flex-col gap-6 flex-1">
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
              <img src="https://ik.imagekit.io/9yt9khgb0/blank-profile-picture-973460_1280.webp?updatedAt=1773933285052" alt="" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={handleLogout}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-[14px] bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer group"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 md:px-10 pt-1 pb-56 md:pb-64 lg:pb-72 overflow-y-auto overflow-x-hidden flex flex-col gap-6 scroll-smooth">
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
                            {[1, 2, 3].map(idx => (
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
                        {[1, 2, 3, 4].map(idx => (
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

      <footer className="fixed bottom-4 md:bottom-5 left-4 lg:left-[154px] right-4 lg:right-6 z-[100] pointer-events-none flex justify-center animate-[slideUp_0.8s_ease-out]">
        <div className="w-full max-w-[1240px] h-[80px] md:h-[100px] bg-gradient-to-br from-slate-400/25 to-zinc-600/15 backdrop-blur-[100px] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.25)] border border-white/10 border-t-white/30 flex items-center px-4 md:px-10 gap-3 md:gap-10 rounded-[28px] md:rounded-full pointer-events-auto ring-1 ring-white/5 transition-all duration-700 hover:from-slate-400/35 hover:to-zinc-600/25 group/bar relative overflow-hidden">
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

          <div className="flex-1 flex flex-col items-center gap-1.5 md:gap-2.5 px-4 md:px-0">
            <div className="flex items-center gap-4 md:gap-10">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`hidden sm:block cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 ${isShuffle ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-white/30 hover:text-white/50'}`}
              >
                <Shuffle strokeWidth={isShuffle ? 4 : 2.5} className={`w-[14px] h-[14px] md:w-[16px] md:h-[16px]`} />
              </button>
              <button
                onClick={handlePrev}
                className="text-white/50 hover:text-white cursor-pointer transition-all duration-300 hover:scale-125 hover:-translate-x-1.5 active:scale-90"
              >
                <SkipBack fill="currentColor" className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-[46px] h-[46px] md:w-[58px] md:h-[58px] bg-gradient-to-tr from-[#3B82F6] to-[#2563EB] text-white rounded-full flex items-center justify-center shadow-[0_15px_30px_-8px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.6)] hover:scale-110 active:scale-95 transition-all duration-500 cursor-pointer group/play relative overflow-hidden ring-1 ring-white/30"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/play:opacity-100 transition-opacity duration-500"></div>
                {isPlaying ? <Pause fill="white" className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]" /> : <Play fill="white" className="w-[22px] h-[22px] md:w-[26px] md:h-[26px] ml-1" />}
              </button>
              <button
                onClick={handleNext}
                className="text-white/50 hover:text-white cursor-pointer transition-all duration-300 hover:scale-125 hover:translate-x-1.5 active:scale-90"
              >
                <SkipForward fill="currentColor" className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />
              </button>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`hidden sm:block cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 ${isRepeat ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-white/30 hover:text-white/50'}`}
              >
                <Repeat strokeWidth={isRepeat ? 4 : 2.5} className={`w-[14px] h-[14px] md:w-[16px] md:h-[16px]`} />
              </button>
            </div>
            <div className="w-full flex items-center gap-4">
              <span className="text-[10px] font-black text-white/50 tabular-nums w-8 text-right tracking-tight">{formatTime(currentTime)}</span>
              <div
                onClick={handleSeek}
                className="flex-1 h-1.5 bg-white/10 rounded-full relative group/seek cursor-pointer overflow-hidden backdrop-blur-md ring-1 ring-white/5"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                ></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity" style={{ left: `${progress}%`, marginLeft: '-6px' }}></div>
              </div>
              <span className="text-[10px] font-black text-white/50 tabular-nums w-8 tracking-tight">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-5 w-[280px] justify-end group/vol pr-4">
            <button onClick={() => setIsMuted(!isMuted)} className="cursor-pointer transition-all hover:scale-125 hover:rotate-6">
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]" /> : <Volume2 className="w-5 h-5 text-white/90 group-hover/vol:text-white transition-colors" />}
            </button>
            <div className="relative w-32 h-6 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#3B82F6] hover:bg-white/20 transition-all focus:outline-none volume-slider"
              />
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
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
        .volume-slider {
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.4);
          height: 4px !important;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.9);
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          border: 2.5px solid white;
        }
        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          box-shadow: 0 0 18px rgba(59, 130, 246, 1);
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