import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import { GAME_CONFIG } from "./config/gameConfig.js";
import { GRAVITY, LEVELS } from "./config/constants.js";
import { ScoreService } from "./interfaces/ScoreService.js";
import { createPlayer } from "./player.js";
import { createCoinsLabel } from "./ui.js";

export class GameFacade {
    // CAMBIO 1: El constructor ahora RECIBE el servicio de puntajes como una dependencia.
    constructor(scoreService) {
        // Guardamos la dependencia para poder usarla en otros métodos.
        this.scoreService = scoreService;

        // El resto de la inicialización es la misma.
        kaboom(GAME_CONFIG);
        setGravity(GRAVITY);
        this.loadAssets();
        this.defineScenes();
    }

    startGame() {
        go("game", { levelId: 0, coins: 0 });
    }

    loadAssets() {
        loadSprite("player", "sprites/player.png");
        loadSprite("coin", "sprites/coin.png");
        loadSprite("bg", "sprites/background.png");
        loadSprite("block", "sprites/block.png");
        loadSprite("endgame-bg", "sprites/backend.png");
    }

    defineScenes() {
        // CAMBIO 3: SOLUCIÓN AL PROBLEMA DE 'this'.s
        // Guardamos una referencia a la instancia de la fachada (`this`)
        // para poder usarla dentro de las funciones de Kaboom (`scene`).
        const facade = this;

        scene("game", ({ levelId = 0, coins = 0 } = {}) => {
            add([
                sprite("bg", { width: width(), height: height() }),
                fixed(),
            ]);

            const level = addLevel(LEVELS[levelId], LEVEL_CONF);
            const coinsLabel = createCoinsLabel(coins);
            const tileWidth = LEVEL_CONF.tileWidth;
            const tileHeight = LEVEL_CONF.tileHeight;
            const startX = 3 * tileWidth;
            const startY = (LEVELS[levelId].length - 2) * tileHeight - 10;
            const player = createPlayer(vec2(startX, startY));

            onUpdate(() => {
                if (!player.exists()) return; // Previene errores si el jugador es destruido
                const mapWidth = LEVELS[levelId][0].length * LEVEL_CONF.tileWidth;
                const mapHeight = LEVELS[levelId].length * LEVEL_CONF.tileHeight;
                const camX = clamp(player.pos.x, width() / 2, mapWidth - width() / 2);
                const camY = clamp(player.pos.y, height() / 2, mapHeight - height() / 2);
                camPos(vec2(camX, camY));
            });

            player.onCollide("coin", (c) => {
                destroy(c);
                coins++;
                coinsLabel.update(coins);
            });

            player.onCollide("danger", () => {
                go("gameover", { coins, levelId });
            });

            player.onCollide("goal", () => {
                if (levelId + 1 < LEVELS.length) {
                    go("game", { levelId: levelId + 1, coins });
                } else {
                    go("win", { coins });
                }
            });
        });

        scene("gameover", async ({ coins, levelId }) => {
            // Usamos 'facade' en lugar de 'this' para llamar al método.
            await facade.handleEndGame(coins, levelId, "GAME OVER");
        });

        scene("win", async ({ coins }) => {
            // Usamos 'facade' en lugar de 'this' para llamar al método.
            await facade.handleEndGame(coins, 0, "¡Ganaste!");
        });
    }

    async handleEndGame(coins, levelId, endMessage) {
        // NUEVO: Agregar imagen de fondo para la pantalla de fin de juego
        add([
            sprite("endgame-bg", { width: width(), height: height() }),
            fixed(),
        ]);

        // NUEVO: Agregar una capa semi-transparente para mejorar la legibilidad del texto
        add([
            rect(width(), height()),
            color(0, 0, 0, 0.6), // Negro con 60% de transparencia
            fixed(),
        ]);

        add([
            text(endMessage, { size: 48, font: "sink" }),
            pos(width() / 2, height() / 5),
            anchor("center"),
            color(255, 255, 255), // Texto blanco para mejor contraste
        ]);

        const nombre = prompt("Ingresa tu nombre:") || "Jugador";
        
        let scores = [];
        try {
            // CAMBIO 2: Usa la dependencia inyectada, NO 'fetch' directamente.
            await this.scoreService.saveScore(nombre, coins);
            scores = await this.scoreService.getScores();

        } catch (err) {
            console.warn("No se pudo conectar al servidor de puntajes:", err);
            scores = [{ nombre, puntuacion: coins }];
        }

        add([
            text("Mejores puntajes:\n\n\n" +
                scores.map(s => `${s.nombre}: ${s.puntuacion}`).join("\n"),
                { size: 24, font: "sink" }),
            pos(width() / 2, height() / 2 - 20),
            anchor("center"),
            color(255, 255, 255), // Texto blanco para mejor contraste
        ]);
        
        const retry = add([
            text("Reintentar (R) | Nuevo Juego (Enter)", { size: 32, font: "sink" }),
            pos(width() / 2, height() / 2 + 170),
            anchor("center"),
            area(),
            color(255, 255, 0), // Texto amarillo para destacar las instrucciones
        ]);

        // Evento de clic para reintentar
        retry.onClick(() => {
            go("game", { levelId, coins: 0 });
        });

        // MODIFICADO: Reintentar con R (mismo nivel)
        onKeyPress("r", () => {
            go("game", { levelId, coins: 0 });
        });

        // NUEVO: Iniciar nuevo juego con Enter (desde el nivel 0)
        onKeyPress("enter", () => {
            go("game", { levelId: 0, coins: 0 });
        });
    }
}