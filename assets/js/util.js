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
                    skipEmptyLines: true, // Leere Zeilen ignorieren
                    delimiter: ";",       // WICHTIG: Semikolon als Trenner
                    complete: (results) => {
                        // Optional: Debugging, falls mal was nicht lädt
                        // console.log("CSV geladen:", results.data); 
                        resolve(results.data);
                    },
                    error: (error) => reject(error)
                });
            });
        } catch (error) {
            console.error("CSV Load Error:", error);
            throw error;
        }
    },

    // 2. Strings sicher verarbeiten (entfernt Leerzeichen, verhindert 'null' Fehler)
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
            // Entfernt "1) ", "2) " am Anfang, falls vorhanden
            const cleanText = item.replace(/^\d+\)\s*/, '');
            return `<li>${cleanText}</li>`;
        }).join('');
    },

    // 5. Brotschritte gruppieren
    // Hilft, Zeilen nach ID zu bündeln (falls man Daten anders verarbeiten will)
    groupSteps: function(data) {
        return data.reduce((acc, row) => {
            // KORREKTUR: Hier jetzt 'brot_id' statt 'Brot_Referenz_Nummer'
            const id = row.brot_id;
            
            // Leere IDs überspringen
            if (!id) return acc;

            if (!acc[id]) acc[id] = [];
            acc[id].push(row);
            return acc;
        }, {});
    }
};