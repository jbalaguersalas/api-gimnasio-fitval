# PR: Crear y borrar clases

**Rama:** `feature/create-delete-class`

## Qué he hecho

- 

## Rutas

- `POST /api/classes`
- `DELETE /api/classes/:id`

## Pruebas (en este orden)

| Petición | Esperado | Obtenido |
|---|---|---|
| `POST` con el body del enunciado | `201`, `"trainerName": "Rubén Castro"` |  |
| `"spots": 0` | `400` |  |
| `"trainerId": 99` | `400` |  |
| `"startsAt": "mañana"` | `400` |  |
| `"activity": "   "` | `400` |  |
| Campo de más `"id": 1` | `400` |  |
| `DELETE /api/classes/8` | `200` |  |
| El mismo `DELETE` otra vez | `404` |  |
| `DELETE /api/classes/1` | `409` |  |
