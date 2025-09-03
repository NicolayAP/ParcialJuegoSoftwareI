import { SPEED, JUMP_FORCE } from "./config.js";

export function createPlayer(initialPos = vec2(100,100)) {
    const player = add([
        sprite("player", { width: 60, height: 62 }),
        pos(initialPos),
        area(),
        body(),
    ]);

    // Movimiento izquierda (A o ←)
    onKeyDown("a", () => player.move(-SPEED, 0));
    onKeyDown("left", () => player.move(-SPEED, 0));

    // Movimiento derecha (D o →)
    onKeyDown("d", () => player.move(SPEED, 0));
    onKeyDown("right", () => player.move(SPEED, 0));

    // Saltar (Espacio, W o ↑)
    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });
    onKeyPress("w", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });
    onKeyPress("up", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });

    // Caída rápida (↓)
    onKeyPress("down", () => { player.weight = 3; });
    onKeyRelease("down", () => { player.weight = 1; });

    return player;
}
