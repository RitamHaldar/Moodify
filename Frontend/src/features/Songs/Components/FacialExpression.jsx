import { detect, init } from "../utils/utils";
import { useEffect, useRef, useState } from "react";
import { Smile, Frown, Meh, Zap } from "lucide-react";

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
        <div className="facial-expression">
            <video
                ref={videoRef}
                className="facial-expression__video-hidden"
                playsInline
            />

            <div className="facial-expression__content">
                <span className="facial-expression__label">Look At The Camera</span>
                <span className="facial-expression__label">CURRENT MOOD</span>
                <div className="facial-expression__status">
                    {getExpressionIcon()}
                    <h2 className="facial-expression__display">{expression}</h2>
                </div>
            </div>

            <div className="facial-expression__footer">
                <button
                    className="atmosphere-hero__play-btn"
                    onClick={handleGetSongsFlow}
                >
                    Get Songs
                </button>

                <button
                    className="atmosphere-hero__play-btn"
                    onClick={handleDetect}
                >
                    Detect Expression
                </button>
            </div>
        </div>
    );
}
