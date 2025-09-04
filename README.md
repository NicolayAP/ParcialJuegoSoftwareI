# Juego Runner 2D

Este repositorio contiene todo lo necesario para el desarrollo de un **juego Runner en 2D**, implementado con la librería **Kaboom.js**.

---

## 🎮 Descripción

El juego consiste en un personaje que se mueve utilizando las **flechas del teclado** para esquivar obstáculos y recolectar monedas.

- 🕹️ **Controles**:  
  - Flechas de dirección → movimiento  
  - Barra espaciadora (si aplica) → salto  

- 🏃‍♂️ **Dinámica de juego**:  
  - El jugador debe saltar sobre obstáculos que aparecen en el escenario.  
  - Existen **monedas** distribuidas en el mapa que pueden ser recogidas.  
  - Las monedas recolectadas se acumulan y se muestran en la **esquina superior izquierda** de la pantalla.  
  - Al perder, se solicita al jugador ingresar su nombre y luego se muestra un **ranking con los 10 mejores puntajes** (basado en monedas recogidas).  

---

## 🚀 Ejecución

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
