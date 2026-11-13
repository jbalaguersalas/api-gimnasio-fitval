# PR: Solo el personal crea y borra clases

**Rama:** `feature/staff-guard`

## Qué he hecho

- 

## Rutas protegidas

- `POST /api/classes` → `AuthGuard` + `StaffGuard`
- `DELETE /api/classes/:id` → `AuthGuard` + `StaffGuard`

## Pruebas (en este orden)

| Petición | Esperado | Obtenido |
|---|---|---|
| `GET /api/classes`, sin token | `200` |  |
| `POST /api/classes`, sin token | `401` |  |
| `POST /api/classes`, token de Ana | `403` |  |
| `POST /api/classes`, token de recepción (`member`) | `403` |  |

*(Aquí recepción pasa a `staff` con `psql`, sin volver a hacer login)*

| Petición | Esperado | Obtenido |
|---|---|---|
| `POST /api/classes`, mismo token de recepción | `201` |  |
| `DELETE /api/classes/1`, token de recepción | `409` |  |
| `DELETE /api/classes/6`, token de Ana | `403` |  |
| `DELETE /api/classes/6`, token de recepción | `200` |  |
