# PR: Leer planes y clases

**Rama:** `feature/read-classes`

## Qué he hecho

- 

## Rutas

- `GET /api/plans`
- `GET /api/classes`
- `GET /api/classes?activity=...`
- `GET /api/classes/:id`

## Pruebas

| Petición | Esperado | Obtenido |
|---|---|---|
| `GET /api/plans` | `200`, 4 planes; el primero Mañanas con `19.9` |  |
| `GET /api/classes` | `200`, 7 clases; la primera Spinning con Carla Navarro |  |
| `GET /api/classes?activity=yoga` | `200`, 2 clases |  |
| `GET /api/classes?activity=SPIN` | `200`, 2 clases |  |
| `GET /api/classes/7` | `200`, Crossfit con 3 plazas |  |
| `GET /api/classes/abc` | `400` |  |
| `GET /api/classes/99` | `404` |  |
| `?activity=zzz' OR 1=1 --` (versión `$1`) | `200`, 0 clases |  |
