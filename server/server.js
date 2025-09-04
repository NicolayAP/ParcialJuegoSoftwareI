import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());
app.use(express.static(".")); // sirve los archivos del juego (index.html, main.js, etc.)

const DATA_FILE = path.join(process.cwd(), "puntajes.json");

// Asegurarse que puntajes.json existe
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

// GET → devuelve los puntajes guardados
app.get("/scores", (req, res) => {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const scores = JSON.parse(data);
    res.json(scores);
});

// POST → guarda un nuevo puntaje y mantiene solo el Top 10
app.post("/scores", (req, res) => {
    const { nombre, puntuacion } = req.body;

    if (!nombre || typeof puntuacion !== "number") {
        return res.status(400).json({ error: "Datos inválidos" });
    }

    const data = fs.readFileSync(DATA_FILE, "utf-8");
    let scores = JSON.parse(data);

    scores.push({ nombre, puntuacion });

    // Ordenar de mayor a menor y limitar a 10
    scores.sort((a, b) => b.puntuacion - a.puntuacion);
    scores = scores.slice(0, 10);

    fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2), "utf-8");

    res.json(scores);
});

app.listen(PORT, () => {
    console.log(`Servidor de puntajes corriendo en http://localhost:${PORT}`);
});
