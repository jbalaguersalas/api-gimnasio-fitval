# PR: Registro y login

**Rama:** `feature/auth`

## Qué he hecho

- 

## Rutas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Pruebas

| Petición | Esperado | Obtenido |
|---|---|---|
| Registro `ana@gym.com` / `12345678` | `201`, `"role": "member"`, sin hash |  |
| El mismo registro otra vez | `409` |  |
| `"email": "ana"` | `400` |  |
| `"password": "123"` | `400` |  |
| Login con Ana | `200`, con `accessToken` |  |
| Login con contraseña mal | `401` |  |
| Login con correo que no existe | `401`, mismo mensaje |  |
| `GET /api/auth/me` con token de Ana | `200` |  |
| `GET /api/auth/me` sin token | `401` |  |
| `GET /api/auth/me` con token cambiado | `401` |  |
