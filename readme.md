# API del gimnasio FitVal

He construido la API que usaría la web del gimnasio FitVal: guarda los datos del gimnasio y responde a lo que la web le pide.

## Qué hace

- Muestra los planes y sus precios.
- Muestra el horario de clases, con su sala, hora y monitor.
- Permite registrarse y entrar con correo y contraseña.
- Solo el personal del gimnasio puede crear y borrar clases.

## Seguridad

- Las contraseñas se guardan cifradas.
- Las consultas están protegidas contra ataques a la base de datos.
- No se puede borrar una clase que ya tiene reservas.

## Tecnologías

NestJS, PostgreSQL, Docker y GitHub.
