import { useState, useRef, useEffect } from 'react';
import { Home, UploadCloud, LogOut, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, ListVideo, Music, User, Smile, Frown, Meh, Zap } from 'lucide-react';
import '../Styles/Dashboard.scss';
import { useSong } from '../Hooks/useSong';
import FacialExpression from '../Components/FacialExpression'
const moodcards = [
    { name: "Happy", icon: Smile, gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
    { name: "Sad", icon: Frown, gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" },
    { name: "Surprised", icon: Zap, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { name: "Neutral", icon: Meh, gradient: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)" }
];

const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const Dashboard = () => {
    const { songs, loading, handleGetSongs, handleLogout, user } = useSong();
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [activeNav, setActiveNav] = useState('Home');

    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current && currentSong) {
            audioRef.current.src = currentSong.songUrl;
            if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
            else audioRef.current.pause();
        }
    }, [currentSong]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
            else audioRef.current.pause();
        }
    }, [isPlaying]);

    const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
    const handleLoadedMetadata = () => setDuration(audioRef.current.duration);
    const handleEnded = () => isRepeat ? (audioRef.current.currentTime = 0, audioRef.current.play()) : handleNext();

    const handlePlayPause = () => {
        if (!currentSong && songs.length > 0) {
            playSong(songs[0]);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e) => {
        const val = parseFloat(e.target.value);
        audioRef.current.currentTime = val;
        setCurrentTime(val);
    };

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        audioRef.current.volume = val;
    };

    const handlePrev = () => {
        if (!songs.length) return;
        const idx = songs.findIndex(s => s.songUrl === currentSong?.songUrl);
        const prevIdx = isShuffle ? Math.floor(Math.random() * songs.length) : (idx - 1 + songs.length) % songs.length;
        playSong(songs[prevIdx]);
    };

    const handleNext = () => {
        if (!songs.length) return;
        const idx = songs.findIndex(s => s.songUrl === currentSong?.songUrl);
        const nextIdx = isShuffle ? Math.floor(Math.random() * songs.length) : (idx + 1) % songs.length;
        playSong(songs[nextIdx]);
    };

    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const navItems = [
        { label: 'Home', icon: <Home size={18} /> },
    ];

    return (
        <div className="dashboard">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            <aside className="sidebar">
                <div className="sidebar__brand">
                    <div className="sidebar__brand-icon"><Music size={20} /></div>
                    <div>
                        <div className="sidebar__brand-name">MoodSync</div>
                        <div className="sidebar__brand-tag">Tune into your atmosphere</div>
                    </div>
                </div>

                <nav className="sidebar__nav">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            className={`sidebar__nav-item ${activeNav === item.label ? 'active' : ''}`}
                            onClick={() => setActiveNav(item.label)}
                        >
                            <span className="sidebar__nav-icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="main">
                <header className="topbar">
                    <div className="topbar__right">
                        <div className="topbar__user">
                            <div className="topbar__user-info">
                                <span className="topbar__user-name">{user}</span>
                            </div>
                            <div className="topbar__avatar"><User size={18} /></div>
                        </div>
                        <button className="topbar__icon-btn" onClick={handleLogout}><LogOut size={18} /></button>
                    </div>
                </header>

                <section className="atmosphere-hero">
                    <FacialExpression onGetSongs={handleGetSongs} />
                </section>

                <section className="mood-discovery">
                    <div className="mood-discovery__header">
                        <h2>Mood Discovery</h2>
                    </div>
                    <div className="mood-discovery__grid">
                        {moodcards.map((card) => (
                            <div
                                key={card.name}
                                className="mood-card"
                                style={{ background: card.gradient }}
                                onClick={() => handleGetSongs(card.name.toLowerCase())}
                            >
                                <card.icon className="mood-card__bg-icon" size={140} />
                                <div className="mood-card__info">
                                    <div className="mood-card__header-row">
                                        <card.icon size={24} className="mood-card__icon" />
                                        <h3>{card.name}</h3>
                                    </div>
                                    <p>Click to find {card.name.toLowerCase()} beats</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="recent-sessions">
                    <h2>Songs for you</h2>
                    <div className="recent-sessions__list">
                        {loading ? (
                            <div className="loading-state">Finding your rhythm...</div>
                        ) : songs.length > 0 ? (
                            songs.map((song, i) => (
                                <div
                                    key={song._id || i}
                                    className={`session-row ${currentSong?.songUrl === song.songUrl ? 'session-row--active' : ''}`}
                                    onClick={() => playSong(song)}
                                >
                                    <span className="session-row__num">{String(i + 1).padStart(2, '0')}</span>
                                    <div className="session-row__art" style={{ backgroundImage: `url(${song.posterUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                        {currentSong?.songUrl === song.songUrl && isPlaying ? <div className="playing-bars" /> : !song.posterUrl && <Music size={16} />}
                                    </div>
                                    <div className="session-row__info">
                                        <span className="session-row__title">{song.title}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">No songs found. Try a different mood!</div>
                        )}
                    </div>
                </section>
            </main>

            <footer className="player-bar">
                <div className="player-bar__song">
                    <div className="player-bar__art" style={{ backgroundImage: `url(${currentSong?.posterUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        {!currentSong?.posterUrl && <Music size={20} />}
                    </div>
                    <div className="player-bar__meta">
                        <span className="player-bar__title">{currentSong?.title || 'Select a song'}</span>
                    </div>
                </div>

                <div className="player-bar__center">
                    <div className="player-bar__controls">
                        <button className={`player-bar__ctrl-btn ${isShuffle ? 'active' : ''}`} onClick={() => setIsShuffle(!isShuffle)}>
                            <Shuffle size={16} />
                        </button>
                        <button className="player-bar__ctrl-btn" onClick={handlePrev}>
                            <SkipBack size={18} fill="currentColor" />
                        </button>
                        <button className="player-bar__play-btn" onClick={handlePlayPause}>
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <button className="player-bar__ctrl-btn" onClick={handleNext}>
                            <SkipForward size={18} fill="currentColor" />
                        </button>
                        <button className={`player-bar__ctrl-btn ${isRepeat ? 'active' : ''}`} onClick={() => setIsRepeat(!isRepeat)}>
                            <Repeat size={16} />
                        </button>
                    </div>

                    <div className="player-bar__progress">
                        <span className="player-bar__time">{formatTime(currentTime)}</span>
                        <div className="player-bar__seek-wrap">
                            <div className="player-bar__seek-fill" style={{ width: `${(currentTime / duration || 0) * 100}%` }} />
                            <input type="range" className="player-bar__seek" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={handleSeek} />
                        </div>
                        <span className="player-bar__time">{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="player-bar__right">
                    <button className="player-bar__ctrl-btn"><Volume2 size={16} /></button>
                    <div className="player-bar__volume-wrap">
                        <div className="player-bar__volume-fill" style={{ width: `${volume * 100}%` }} />
                        <input type="range" className="player-bar__volume" min="0" max="1" step="0.01" value={volume} onChange={handleVolume} />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;