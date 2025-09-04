export class ScoreService {
    async getScores() {
        // Lanza un error si una clase hija no implementa este método.
        throw new Error("getScores() must be implemented by a subclass.");
    }

    async saveScore(nombre, puntuacion) {
        // Lanza un error si una clase hija no implementa este método.
        throw new Error("saveScore() must be implemented by a subclass.");
    }
}
