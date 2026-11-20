# API del gimnasio FitVal

Práctica del bootcamp de Full Stack de The Bridge.

He construido la API que usaría la web del gimnasio FitVal: guarda los datos del gimnasio y responde a lo que la web le pide.

La base de datos es la del gimnasio que diseñé antes en SQL: planes, socios, tarjetas, monitores, clases y reservas. Encima he montado la API con NestJS y le he añadido usuarios con contraseña.

## Qué hace

- Muestra los planes y sus precios.
- Muestra el horario de clases, con su sala, hora y monitor.
- Permite registrarse y entrar con correo y contraseña.
- Solo el personal del gimnasio puede crear y borrar clases.

## Rutas

Todas empiezan por `/api`.

| Método | Ruta | Quién puede | Qué hace |
|---|---|---|---|
| GET | `/api/health` | Cualquiera | Comprueba que la API llega a PostgreSQL |
| GET | `/api/plans` | Cualquiera | Planes ordenados de más barato a más caro |
| GET | `/api/classes` | Cualquiera | Horario de clases. Con `?activity=yoga` filtra por actividad |
| GET | `/api/classes/:id` | Cualquiera | Una clase con el nombre de su monitor |
| POST | `/api/classes` | Personal | Crea una clase (`activity`, `room`, `startsAt`, `spots`, `trainerId`) |
| DELETE | `/api/classes/:id` | Personal | Borra una clase si no tiene reservas |
| POST | `/api/auth/register` | Cualquiera | Crea un usuario con email y contraseña (mínimo 8 caracteres) |
| POST | `/api/auth/login` | Cualquiera | Devuelve un `accessToken` |
| GET | `/api/auth/me` | Con token | Devuelve el usuario del token |

Las rutas protegidas piden la cabecera `Authorization: Bearer <token>`. Todo usuario nuevo se crea como `member`. Para que alguien sea personal hay que cambiarle el rol a `staff` en la tabla `users`.

## Seguridad

- Las contraseñas se guardan cifradas.
- Las consultas están protegidas contra ataques a la base de datos.
- No se puede borrar una clase que ya tiene reservas.

Más en concreto: las contraseñas pasan por argon2 antes de guardarse. Todas las consultas usan parámetros (`$1`, `$2`) en vez de pegar el texto del usuario dentro del SQL. Y la API rechaza cualquier campo del body que no esté en el DTO.

## Cómo arrancarlo en mi ordenador

```bash
docker compose up -d                                              # PostgreSQL 17 en el puerto 5434
docker exec -i postgres-fitval psql -U alumno -d fitval < database/schema.sql   # tablas y datos de prueba
npm install
cp .env.example .env
npm run start:dev                                                 # http://localhost:3000/api
```

En el `.env` hay que poner `DATABASE_URL` con la contraseña del `compose.yaml` y un `JWT_SECRET` cualquiera para firmar los tokens.

`npm run lint` revisa el código. Es lo mismo que pasa GitHub Actions en cada pull request.

## Cómo he trabajado

La rama `main` está protegida, así que cada parte la he hecho en su rama y la he subido con una pull request. En [`docs/prs/`](docs/prs) están las plantillas de las cinco pull requests, con las pruebas que había que hacer en cada una:

1. Conectar con PostgreSQL.
2. Planes y clases.
3. Crear y borrar clases.
4. Registro y login.
5. Solo el personal crea y borra clases.

Las respuestas a las preguntas de la práctica están en [`respuestas.md`](respuestas.md).

## He aprendido

**Qué es una inyección SQL.** Si busco clases con el texto `zzz' OR 1=1 --` y lo pego tal cual en la consulta, salen las 7 clases en vez de ninguna. Con `$1`, PostgreSQL busca ese texto como texto y no sale nada.

**A comprobar antes de que falle la base de datos.** PostgreSQL ya rechaza una clase con un monitor que no existe, pero el cliente recibiría un 500. Si lo compruebo yo antes, le devuelvo un 400 con un mensaje que entiende.

**A no meter el rol en el token.** El token solo lleva el id del usuario. El rol lo miro en la base de datos en cada petición. Así, si a alguien le dan permisos de personal, le funcionan sin volver a hacer login, y si se los quitan, los pierde al momento.

**Que 409 y 400 son cosas distintas.** Borrar una clase con reservas es una petición bien hecha que choca con los datos que hay, así que devuelvo 409.

## Tecnologías

NestJS, PostgreSQL, Docker y GitHub.

- **NestJS** con TypeScript, `class-validator` para validar lo que llega y `@nestjs/jwt` para los tokens.
- **PostgreSQL 17** con la librería `pg`, escribiendo el SQL a mano.
- **argon2** para cifrar las contraseñas.
- **Docker** para la base de datos.
- **GitHub Actions** para revisar el código en cada pull request.
