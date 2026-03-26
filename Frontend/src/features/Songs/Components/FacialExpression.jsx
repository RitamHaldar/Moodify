import { detect, init } from "../utils/utils";
import { useEffect, useRef, useState } from "react";
import { Smile, Frown, Meh, Zap, Music } from "lucide-react";

export default function FaceExpression({ onGetSongs }) {

    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamref = useRef(null);
    const [expression, setExpression] = useState("Detecting...");
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
        detect({ landmarkerRef, setExpression, videoRef });
    };

    const handleGetSongsFlow = () => {
        const mood = expression.toLowerCase();
        if (onGetSongs) onGetSongs(mood);
    };

    const getExpressionIcon = () => {
        switch (expression) {
            case "Happy": return <Smile size={48} className="expression-icon" />;
            case "Sad": return <Frown size={48} className="expression-icon" />;
            case "Surprised": return <Zap size={48} className="expression-icon" />;
            case "Neutral": return <Meh size={48} className="expression-icon" />;
            default: return <Meh size={48} className="expression-icon" />;
        }
    };

    return (
        <div className="facial-expression extraordinary-glass">
            <div className="detection-hud">
                <div className="detection-hud__scanner"></div>

                <div className="detection-hud__icon-wrap">
                    <Music className="detection-hud__music-icon" size={40} />
                </div>

                <div className="detection-hud__viz">
                    <div className="detection-hud__face-wrap">
                        {expression === "Happy" && <Smile size={64} className="mood-icon happy" />}
                        {expression === "Sad" && <Frown size={64} className="mood-icon sad" />}
                        {expression === "Neutral" && <Meh size={64} className="mood-icon neutral" />}
                        {expression === "Detecting..." && <Zap size={64} className="mood-icon detecting" />}
                    </div>

                    <div className="detection-hud__status">
                        <span className="status-label">STATUS</span>
                        <h2 className="status-value">{expression}</h2>
                    </div>
                </div>
            </div>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="facial-expression__video-hidden"
            />

            <div className="facial-expression__footer">
                <button
                    className="glass-btn extraordinary-glass"
                    onClick={handleGetSongsFlow}
                >
                    <Music size={18} />
                    <span>Get Songs</span>
                </button>

                <button
                    className="glass-btn extraordinary-glass"
                    onClick={handleDetect}
                >
                    <Zap size={18} />
                    <span>Detect Expression</span>
                </button>
            </div>
        </div>
    );
}
