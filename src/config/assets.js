// assets.js
export const LEVELS = [
    [
        "                                           ",
        "         $                                 ",
        "                                            ",
        "     ===             $                      ",
        "               ^                   $        ",
        "     = ^     ===      ^     $          @   ",
        "=========================================",
    ],
    [
        "                                       ",
        "   $                               ",
        "           ===                         ",
        "       ^            $    ===              ",
        "      ===    ===  ^          $ ^    @   ",
        "=====================================",
    ]
];

export const LEVEL_CONF = {
    tileWidth: 64,
    tileHeight: 64,
    tiles: {
        // plataformas estáticas
        "=": () => [
            rect(64, 32),
            color(0.3, 0.7, 0.3),
            area(),
            body({ isStatic: true }), // ⬅️ esto reemplaza a solid()
            anchor("bot"),
            "platform",
        ],



        // pinchos
        "^": () => [
            polygon([vec2(0, 32), vec2(32, 32), vec2(16, 0)]),
            color(1, 0, 0),
            area(),
            "danger",
            anchor("bot")
        ],

        // monedas
        "$": () => [
             sprite("coin", { width: 52, height: 52 }),
            area(),
            "coin",
            anchor("center")
        ],
        // assets.js
        "@": () => [
            rect(64, 64),
            color(0, 0, 1),  // azul
            area(),
            "goal",
        ],
    }
};
