import { createContext, useState } from "react";

export const SongContext = createContext();

const SongProvider = ({ children }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    return (
        <SongContext.Provider value={{ songs, setSongs, loading, setLoading }}>
            {children}
        </SongContext.Provider>
    );
};

export default SongProvider;