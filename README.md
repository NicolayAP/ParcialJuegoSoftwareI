Plataformas Kaboom - Parcial de Software I

Este es un juego de plataformas desarrollado con la librería Kaboom.js. El proyecto incluye un sistema de niveles, recolección de monedas y un backend simple para la persistencia de los 10 mejores puntajes.

La arquitectura del juego ha sido refactorizada para seguir principios de diseño de software modernos como SOLID, IoC y patrones de diseño como Facade y Factory.

🚀 Instrucciones para Ejecutar el Juego

Para poder jugar, necesitas tener instalado Node.js (que incluye npm). Sigue estos pasos:

1. Clonar el Repositorio (si aún no lo tienes):

git clone [URL\_DEL\_REPOSITORIO]

cd [NOMBRE\_DE\_LA\_CARPETA]


1. Instalar Dependencias del Servidor:

Abre una terminal en la carpeta del proyecto y ejecuta el siguiente comando para instalar las librerías necesarias para el servidor de puntajes (Express y CORS).

npm install


1. Iniciar el Servidor de Puntajes:

En la misma terminal, inicia el servidor. Este debe permanecer corriendo en segundo plano mientras juegas.

node server.js


Deberías ver el mensaje: Servidor de puntajes corriendo en http://localhost:3000.

1. Abrir el Juego:

Abre el archivo index.html en tu navegador web. ¡Y listo, a jugar!

👥 Integrantes y Roles

[Ángel - Nombre Completo]:

Rol: Arquitecto de Software y Desarrollador Backend.

Responsabilidades: Refactorización de la arquitectura para implementar los patrones Facade, Factory e Inyección de Dependencias. Desarrollo del servidor de puntajes con Express.js y corrección de bugs de gameplay.

[Nicolay - Nombre Completo]:

Rol: Diseñador de Niveles y Desarrollador Frontend.

Responsabilidades: Diseño de los niveles del juego, implementación de la lógica inicial del jugador y los assets visuales.

CONFLICTO Evidencia de Conflicto Resuelto

Durante el desarrollo, nos enfrentamos a un conflicto de fusión (merge conflict) cuando ambos intentamos modificar la lógica de inicio del jugador. Uno de los miembros implementó un sistema de "spawnpoint" en assets.js mientras el otro implementaba un cálculo manual de la posición en main.js.

Al intentar fusionar las ramas con git pull, Git no pudo decidir qué cambio conservar y marcó el archivo en conflicto.

Evidencia (Ejemplo de cómo se veía el conflicto en main.js):

// ... código anterior ...

const level = addLevel(LEVELS[levelId], LEVEL\_CONF);

<<<<<<< HEAD

// Versión de Nicolay (la que estaba en el servidor)

const spawnPoint = get("spawnpoint")[0];

const player = createPlayer(spawnPoint.pos);

destroy(spawnPoint);

\=======

// Versión de Ángel (la que yo tenía localmente)

const tileWidth = LEVEL\_CONF.tileWidth;

const tileHeight = LEVEL\_CONF.tileHeight;

const startX = 3 \* tileWidth;

const startY = (LEVELS[levelId].length - 2) \* tileHeight - 10;

const player = createPlayer(vec2(startX, startY));

\>>>>>>> master

const coinsLabel = createCoinsLabel(coins);

// ... resto del código ...


Resolución:

El conflicto se resolvió siguiendo los pasos estándar de Git:

Comunicación: Hablamos y decidimos que el método de cálculo manual era más robusto para la versión actual y evitaba errores de caché.

Edición Manual: Editamos el archivo main.js para eliminar los marcadores de conflicto (<<<<<<<, =======, >>>>>>>) y dejar únicamente la versión de cálculo manual.

Finalización de la Fusión: Guardamos los cambios y ejecutamos los siguientes comandos para marcar el conflicto como resuelto y completar la sincronización.

git add main.js

git commit -m "fix: Resuelve conflicto de fusión en la creación del jugador"

git push


🏛️ Aplicación de Patrones y Principios

A continuación, se explica brevemente cómo se aplicaron los conceptos de arquitectura de software solicitados.

Facade (Fachada)

Se implementó el patrón Facade en la clase GameFacade (gameFacade.js). Esta clase actúa como una interfaz simplificada que oculta toda la complejidad de la librería Kaboom.js. El punto de entrada del juego (main.js) ya no interactúa directamente con scene(), loadSprite() o go(), sino que simplemente le da órdenes a la fachada, como game.startGame().

SOLID e Inversión de Control (IoC) / Inyección de Dependencias

Se aplicó el principio de Inversión de Dependencias (D) de SOLID.

El Problema: Originalmente, main.js (un módulo de alto nivel) dependía directamente de fetch (un detalle de bajo nivel) para guardar puntajes.

La Solución:

Se creó una abstracción (ScoreService en scoreService.js) que define un "contrato" de lo que un servicio de puntajes debe hacer (getScores, saveScore).

GameFacade ahora depende de esta abstracción, no de una implementación concreta.

Se creó una implementación concreta (ApiScoreService) que cumple el contrato usando fetch.

Se utilizó una Factoría (gameFactory.js) para crear la instancia de ApiScoreService y "inyectársela" a GameFacade a través de su constructor. Este proceso es la Inyección de Dependencias, una forma de lograr la Inversión de Control (IoC).

Adapter (Adaptador)

Aunque no se implementó un Adapter directamente, la arquitectura actual está preparada para ello. Si en el futuro quisiéramos conectar un servicio de puntajes diferente (por ejemplo, Firebase) que tuviera métodos con otros nombres (como obtenerRanking() y guardarPartida()), podríamos crear una clase FirebaseScoreAdapter. Esta clase "adaptaría" la interfaz de Firebase para que cumpliera con nuestro contrato ScoreService, permitiendo cambiar de backend sin modificar la lógica del juego.
