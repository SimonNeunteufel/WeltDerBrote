/**
 * WdB - Welt der Brote: Utility Library
 * Spezialisiert auf CSV-Handling mit Semicolon und Pipe-Listen
 */

window.$util = {
    // 1. CSV Laden (PapaParse Integration)
    loadCsv: async function(url) {
        try {
            const response = await fetch(url);
            const csvText = await response.text();
            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    delimiter: ";", // Dein Standard-Trenner
                    complete: (results) => resolve(results.data),
                    error: (error) => reject(error)
                });
            });
        } catch (error) {
            console.error("CSV Load Error:", error);
            throw error;
        }
    },

    // 2. Strings sicher verarbeiten
    safe: (t) => t ? String(t).trim() : "",

    // 3. Pipe-Listen zerlegen (|)
    // Wandelt "Mehl|Wasser|Salz" in ein Array ["Mehl", "Wasser", "Salz"]
    parsePipe: function(t) {
        if (!t) return [];
        return String(t).split('|').map(x => x.trim()).filter(Boolean);
    },

    // 4. Spezielle Zutaten-Aufzählung verarbeiten
    // Wandelt "1) 500g Mehl|2) 10g Salz" in saubere HTML-Listen-Items
    formatIngredients: function(t) {
        const items = this.parsePipe(t);
        if (items.length === 0) return "<li>Keine Angaben</li>";
        
        return items.map(item => {
            // Optional: Die "1) " Präfixe entfernen, falls man nur den Text will
            const cleanText = item.replace(/^\d+\)\s*/, '');
            return `<li>${cleanText}</li>`;
        }).join('');
    },

    // 5. Brotschritte gruppieren
    // Da ein Rezept in deiner CSV über mehrere Zeilen geht (Vorteig, Hauptteig...)
    // hilft diese Funktion, die Daten nach der Brot_ID zu bündeln.
    groupSteps: function(data) {
        return data.reduce((acc, row) => {
            const id = row.Brot_Referenz_Nummer;
            if (!acc[id]) acc[id] = [];
            acc[id].push(row);
            return acc;
        }, {});
    }
};