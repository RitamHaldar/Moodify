import axios from "axios";

const api = axios.create({
    baseURL: "https://moodsync-ectw.onrender.com",
    withCredentials: true,
});

export async function getSongsByMood(expression) {
    const response = await api.get("/api/songs?mood=" + expression);
    return response.data;
};