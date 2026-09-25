# Nuevas Formas De…

Sitio en Next.js con panel de contenidos en `/admin`.

## Desarrollo

```bash
cp .env.example .env.local   # completar contraseñas y NFD_SESSION_SECRET
npm install
npm run dev
```

Sitio: http://localhost:3000 · Panel: http://localhost:3000/admin

## Panel de contenidos (`/admin`)

| Cuenta | Variables | Puede |
| --- | --- | --- |
| Administración | `NFD_ADMIN_USER`, `NFD_ADMIN_PASSWORD` | Todo, incluido eliminar eventos |
| Usuario (Emiliano) | `NFD_EDITOR_USER`, `NFD_EDITOR_PASSWORD` | Cargar, modificar, publicar, archivar e importar |

- **Eventos:** título, descripción, lugar, enlace, fechas, portada y galería.
  Estados: borrador, publicado o archivado. Todo se puede editar después de publicar.
- **Entrevistas:** se suben con una planilla Excel (.xlsx) o CSV. Columnas:
  `nombre, invitado, info, descripcion, categoria, plataforma, link, foto`.
  El panel permite descargar una plantilla y la lista actual.

## Almacenamiento

- **En Vercel:** crear un Blob store público (Storage → Blob) y conectarlo al
  proyecto. Vercel agrega solo `BLOB_STORE_ID` (o `BLOB_READ_WRITE_TOKEN`); datos e imágenes
  se guardan ahí (con las últimas 10 versiones como respaldo).
- **Sin esas variables:** se guarda en la carpeta local `.content/`.

Mientras no se guarde nada desde el panel, el sitio usa el contenido de
`data/events.ts` y `data/conversations.ts`.
