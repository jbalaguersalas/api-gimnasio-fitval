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

Para devolver un 400 con un mensaje claro, porque el error es del cliente. Sin comprobarlo, PostgreSQL da error de clave ajena y al cliente le llega un 500, como si fallara el servidor.



## Pregunta 4

¿Por qué borrar una clase con reservas es `409` y no `400`?

Porque la petición está bien hecha, el problema es que choca con los datos que hay (las reservas). 400 sería si el cliente mandara algo mal.



## Pregunta 5

¿Qué datos lleva dentro el token de Ana? ¿Por qué no metemos también el rol?

Lleva `{ "sub": 1, "iat": ..., "exp": ... }`: el id de Ana y cuándo se creó y caduca. No va el rol porque si cambia, el token seguiría con el viejo. Mejor mirarlo en la base de datos cada vez. Además el token se puede leer, no es secreto.



## Pregunta 6

El token de recepción se creó cuando todavía era `member`. ¿Por qué funciona ahora sin volver a hacer login? ¿Qué pasaría si el rol fuera dentro del token?

Porque el token solo lleva el id, y el rol se mira en la base de datos en cada petición, así que ya sale staff. Si el rol fuera en el token, seguiría poniendo member hasta volver a hacer login (y al revés, alguien a quien le quitan staff podría seguir creando clases).



## Pregunta 7

¿Por qué el test del 6.4 no necesita PostgreSQL? ¿Qué no puede comprobar un test con un `Pool` falso?

Porque el `Pool` es falso: el `query` responde lo que yo le digo y no se conecta a nada. Lo que no puede comprobar es si el SQL está bien escrito o si la base de datos responde de verdad lo que pongo en el falso.

## Pregunta 8

¿Por qué el correo lleva `Date.now()`? ¿Qué pasaría la segunda vez que ejecutas los tests con un correo fijo?

Para que cada vez sea un correo nuevo. Con uno fijo, la segunda vez el registro da 409 porque ya existe (el login seguiría bien, pero el test depende de lo que quedó de antes).

## Pregunta 9

En la Parte 2 rompiste la API pegando un texto dentro del SQL. Aquí el `ORDER BY` lleva `${...}`. ¿Por qué no es peligroso? Prueba `?sort=id;DROP TABLE classes` y explica qué lo para.

Porque lo que va en el `${...}` no es lo que escribe el cliente, sale de `SORT_COLUMNS`. Y el DTO con `@IsIn` solo deja pasar `startsAt`, `activity` o `spots`. Con `?sort=id;DROP TABLE classes` el `ValidationPipe` da 400 y la consulta ni se ejecuta.

## Pregunta 10

¿Por qué el login tiene un límite más duro que el resto de rutas? ¿Qué ataque frena? ¿Qué pasaría en Render sin `app.set('trust proxy', 1)`?

Porque en el login se pueden probar contraseñas una detrás de otra (fuerza bruta). Con 5 por minuto no da tiempo a probar muchas. Sin `trust proxy`, en Render todas las peticiones parecen venir de la IP del proxy, así que el límite lo compartirían todos los usuarios y se bloquearía a todos a la vez.

