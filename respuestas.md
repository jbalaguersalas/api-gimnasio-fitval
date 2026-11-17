# Respuestas


## Ejercicio 0

remote: error: GH013: Repository rule violations found for refs/heads/main. Changes must be made through a pull request.


## Pregunta 1

¿Qué código recibe el cliente con PostgreSQL parado? ¿Qué ves en la terminal que el cliente no ve? ¿Por qué es mejor así?

Al cliente le llega un 500 y ya. En la terminal sale el error real (`ECONNREFUSED`, no conecta con la base de datos). Mejor así: el cliente no tiene por qué ver eso, yo sí.


## Pregunta 2

¿Cuántas clases salen con cada versión? ¿Qué ha pasado con la consulta en la versión mala?

Con la mala salen las 7, con la buena 0.

Le llega esto: `... WHERE c.activity ILIKE '%zzz' OR 1=1 --%' ORDER BY c.starts_at`. El `OR 1=1` siempre es verdad y el `--` comenta el resto. Con `$1` el texto se busca tal cual y no cambia la consulta.


## Pregunta 3

PostgreSQL ya tiene una clave ajena en `trainer_id`. ¿Para qué comprobamos en la API que el monitor existe? ¿Qué recibiría el cliente si no lo hiciéramos?




## Pregunta 4

¿Por qué borrar una clase con reservas es `409` y no `400`?




## Pregunta 5

¿Qué datos lleva dentro el token de Ana? ¿Por qué no metemos también el rol?




## Pregunta 6

El token de recepción se creó cuando todavía era `member`. ¿Por qué funciona ahora sin volver a hacer login? ¿Qué pasaría si el rol fuera dentro del token?

