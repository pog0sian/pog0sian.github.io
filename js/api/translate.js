import { config } from '../config.js';

export async function translateText(text) {
    try {
        const response = await fetch(config.LARA_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                q: text,
                source: "en",
                target: "ru",
                access_key_id: config.LARA_ACCESS_KEY_ID,
                access_key_secret: config.LARA_ACCESS_KEY_SECRET
            })
        });
        const data = await response.json();
        if (data.status === 200 && data.content?.translation) {
            return data.content.translation;
        } else if (data.error) {
            throw new Error(data.error.message || "Ошибка перевода");
        } else {
            throw new Error("Неверный формат ответа от API");
        }
    } catch (error) {
        console.error("Error fetching translate:", error);
        return text;
    }
}