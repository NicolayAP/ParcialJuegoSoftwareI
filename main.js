import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import { GAME_CONFIG, GRAVITY } from "./config.js";
import { LEVELS, LEVEL_CONF } from "./assets.js";
import { createPlayer } from "./player.js";
import { createCoinsLabel } from "./ui.js";

kaboom(GAME_CONFIG);
setGravity(GRAVITY);

loadSprite("player", "sprites/player.png");
loadSprite("coin", "sprites/coin.png");
loadSprite("bg", "sprites/background.png");

// Escena del juego principal
scene("game", ({ levelId = 0, coins = 0 } = {}) => {
    add([
        sprite("bg", { width: width(), height: height() }),
        fixed(),
    ]);

    const level = addLevel(LEVELS[levelId], LEVEL_CONF);

    const player = createPlayer(vec2(100, 100));
    const coinsLabel = createCoinsLabel(coins);

    // Cámara sigue al jugador
    onUpdate(() => {
        const mapWidth = LEVELS[levelId][0].length * LEVEL_CONF.tileWidth;
        const mapHeight = LEVELS[levelId].length * LEVEL_CONF.tileHeight;

        const camX = clamp(player.pos.x, width() / 2, mapWidth - width() / 2);
        const camY = clamp(player.pos.y, height() / 2, mapHeight - height() / 2);

        camPos(vec2(camX, camY));
    });

    // Colisión con monedas
    player.onCollide("coin", (c) => {
        destroy(c);
        coins++;
        coinsLabel.update(coins);
    });

    // Colisión con trampas (GAME OVER)
    player.onCollide("danger", async () => {
        destroy(player);

        // Texto principal centrado
        add([
            text("GAME OVER", 48),
            pos(width() / 2, height() / 2 - 120),
            anchor("center"),
        ]);

        // Pedir nombre del jugador
        const nombre = prompt("Ingresa tu nombre:") || "Jugador";

        let scores = [];
        try {
            // Enviar puntaje al backend
            await fetch("http://localhost:3000/scores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, puntuacion: coins }),
            });

            // Leer ranking del backend
            const res = await fetch("http://localhost:3000/scores");
            scores = await res.json();
        } catch (err) {
            console.warn("No se pudo conectar al servidor de puntajes:", err);
            scores = [{ nombre, puntuacion: coins }];
        }

        // Mostrar ranking (centrado debajo del título)
        add([
            text("Mejores puntajes:\n" +
                scores.map(s => `${s.nombre}: ${s.puntuacion}`).join("\n"),
                24),
            pos(width() / 2, height() / 2),
            anchor("center"),
        ]);

        // Botón reintentar (debajo del ranking)
        const retry = add([
            text("Reintentar (R)", 32),
            pos(width() / 2, height() / 2 + 140),
            anchor("center"),
            area(),
        ]);

        retry.onClick(() => {
            go("game", { levelId, coins: 0 });
        });

        onKeyPress("r", () => {
            go("game", { levelId, coins: 0 });
        });
    });

    // Colisión con meta (nivel completado)
    player.onCollide("goal", () => {
        if (levelId + 1 < LEVELS.length) {
            go("game", { levelId: levelId + 1, coins });
        } else {
            go("win", { coins });
        }
    });
});

// Escena de victoria
scene("win", ({ coins }) => {
    add([
        text(`¡Ganaste!\nMonedas: ${coins}`, 48),
        pos(width() / 2, height() / 2 - 100),
        anchor("center"),
    ]);

    add([
        text("Presiona R para jugar de nuevo", 24),
        pos(width() / 2, height() / 2 + 140),
        anchor("center"),
    ]);

    onKeyPress("r", () => {
        go("game", { levelId: 0, coins: 0 });
    });
});

// Inicia el juego
go("game", { levelId: 0, coins: 0 });
