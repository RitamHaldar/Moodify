import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, getMe, register } from "../Services/auth.api";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        const response = await login(email, password);
        setUser(response.user.username);
        setLoading(false);
    };

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        const response = await register(username, email, password);
        setUser(response.user.username);
        setLoading(false);
    };


    const handleGetMe = async () => {
        try {
            setLoading(true);
            const response = await getMe();
            setUser(response.user.username);
        } catch (error) {
            console.error("Get me failed:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        handleGetMe();
    }, []);
    return { user, loading, handleLogin, handleRegister, handleGetMe };
}