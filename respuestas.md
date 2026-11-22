# Respuestas


## Ejercicio 0

remote: error: GH013: Repository rule violations found for refs/heads/main. Changes must be made through a pull request.


## Pregunta 1


Al cliente le llega un 500 y ya. En la terminal sale el error real (`ECONNREFUSED`, no conecta con la base de datos). Mejor así: el cliente no tiene por qué ver eso, yo sí.


## Pregunta 2


Con la mala salen las 7, con la buena 0.

Le llega esto: `... WHERE c.activity ILIKE '%zzz' OR 1=1 --%' ORDER BY c.starts_at`. El `OR 1=1` siempre es verdad y el `--` comenta el resto. Con `$1` el texto se busca tal cual y no cambia la consulta.


## Pregunta 3



Para devolver un 400 con un mensaje claro, porque el error es del cliente. Sin comprobarlo, PostgreSQL da error de clave ajena y al cliente le llega un 500, como si fallara el servidor.



## Pregunta 4


Porque la petición está bien hecha, el problema es que choca con los datos que hay (las reservas). 400 sería si el cliente mandara algo mal.



## Pregunta 5



Lleva `{ "sub": 1, "iat": ..., "exp": ... }`: el id de Ana y cuándo se creó y caduca. No va el rol porque si cambia, el token seguiría con el viejo. Mejor mirarlo en la base de datos cada vez. Además el token se puede leer, no es secreto.



## Pregunta 6


Porque el token solo lleva el id, y el rol se mira en la base de datos en cada petición, así que ya sale staff. Si el rol fuera en el token, seguiría poniendo member hasta volver a hacer login (y al revés, alguien a quien le quitan staff podría seguir creando clases).



## Pregunta 7



Porque el `Pool` es falso: el `query` responde lo que yo le digo y no se conecta a nada. Lo que no puede comprobar es si el SQL está bien escrito o si la base de datos responde de verdad lo que pongo en el falso.

## Pregunta 8



Para que cada vez sea un correo nuevo. Con uno fijo, la segunda vez el registro da 409 porque ya existe (el login seguiría bien, pero el test depende de lo que quedó de antes).

## Pregunta 9



Porque lo que va en el `${...}` no es lo que escribe el cliente, sale de `SORT_COLUMNS`. Y el DTO con `@IsIn` solo deja pasar `startsAt`, `activity` o `spots`. Con `?sort=id;DROP TABLE classes` el `ValidationPipe` da 400 y la consulta ni se ejecuta.

## Pregunta 10



Porque en el login se pueden probar contraseñas una detrás de otra (fuerza bruta). Con 5 por minuto no da tiempo a probar muchas. Sin `trust proxy`, en Render todas las peticiones parecen venir de la IP del proxy, así que el límite lo compartirían todos los usuarios y se bloquearía a todos a la vez.


## Pregunta 11

Sin la transacción, se habría guardado Óscar y su primera especialidad (5), pero la segunda (99) habría fallado porque no existe. Nuria no tiene el ID 5 porque PostgreSQL no recupera los números utilizados al hacer un ROLLBACK.


## Pregunta 12


El navegador bloquea el acceso porque solo se permite la dirección http://localhost:5173. Postman sí funciona porque no tiene las mismas restricciones CORS que el navegador.


## Pregunta 13


La API muestra postgres porque está conectada a la base de datos de Supabase. No hubo que cambiar el código porque la conexión se configura con DATABASE_URL.

## Pregunta 14

La foto desaparece al volver a desplegar porque Render no guarda permanentemente los archivos. Aunque la dirección de la foto sigue en PostgreSQL, la imagen ya no existe. La solución sería guardarla en Supabase Storage.


## Pregunta 15


La conexión directa de Supabase no funciona porque Render no puede acceder a ella mediante IPv6. El Session Pooler soluciona este problema. Al cambiar JWT_SECRET, los tokens antiguos dejan de funcionar y la API devuelve un error 401. Cambiaría la clave si se filtrase o sospechase que alguien la conoce.
