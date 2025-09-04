import { ScoreService } from "./scoreServices.js";

// Esta es la implementación "concreta" que usa la API (fetch).
// Cumple con el contrato definido en ScoreService.
export class ApiScoreService extends ScoreService {
    constructor(baseUrl = "http://localhost:3000") {
        super(); // Llama al constructor de la clase padre (ScoreService)
        this.baseUrl = baseUrl;
    }

    // Implementación real del método para obtener puntajes
    async getScores() {
        const res = await fetch(`${this.baseUrl}/scores`);
        if (!res.ok) {
            throw new Error("Failed to fetch scores");
        }
        return await res.json();
    }

    // Implementación real del método para guardar un puntaje
    async saveScore(nombre, puntuacion) {
        await fetch(`${this.baseUrl}/scores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, puntuacion }),
        });
    }
}