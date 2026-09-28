/* =========================================================
   DOCBIZ AI - Frontend
   ========================================================= */

window.DocBizAI = (() => {

    const API_URL = "api/ai.php";

    async function ask(message, context = {}) {
        if (!message || !message.trim()) {
            throw new Error("Unesite pitanje.");
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message.trim(),
                context
            })
        });

        if (!response.ok) {
            throw new Error("AI server trenutno nije dostupan.");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || "AI greška.");
        }

        return data.answer;
    }

    return {
        ask
    };

})();
