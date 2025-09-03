// ui.js
export function createCoinsLabel(initialCoins = 0) {
    const label = add([ text(initialCoins, 32), pos(24,24), fixed() ]);
    return {
        label,
        update: (coins) => label.text = coins
    };
}
