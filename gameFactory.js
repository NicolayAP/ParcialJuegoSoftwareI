import { GameFacade } from "./gameFacade.js";
import { ApiScoreService } from "./apiScoreServices.js";

// Esta función crea y conecta todos los objetos del juego.
export function createGame() {
    // 1. La factoría decide qué implementación usar.
    const scoreService = new ApiScoreService();
    
    // 2. Crea la fachada y le "inyecta" la dependencia.
    const game = new GameFacade(scoreService);
    
    return game;
}