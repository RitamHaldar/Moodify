import { useContext } from "react";
import { SongContext } from "../song.context";
import { getSongsByMood } from "../Services/expression.api";
import { logout } from "../../Auth/Services/auth.api";
import { AuthContext } from "../../Auth/auth.context";

export const useSong = () => {
    const { songs, setSongs, loading, setLoading } = useContext(SongContext);
    const { user, setUser } = useContext(AuthContext);
    const handleGetSongs = async (expression) => {
        try {
            setLoading(true);
            const response = await getSongsByMood(expression);
            setSongs(response.songs);
            return response.songs;
        } catch (error) {
            console.error("Get songs failed:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setUser(null);
        setLoading(false);
    };
    return { handleGetSongs, songs, loading, handleLogout, user };
};