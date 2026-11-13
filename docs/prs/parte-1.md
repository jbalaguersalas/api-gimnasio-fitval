# PR: Conectar con PostgreSQL

**Rama:** `feature/database-connection`

## Qué he hecho

- 

## Rutas

- `GET /api/health`

## Pruebas

| Petición | Esperado | Obtenido |
|---|---|---|
| `GET /api/health` | `200`, `{ "status": "ok", "database": "fitval" }` |  |
| `GET /api/health` con PostgreSQL parado | `500` |  |
