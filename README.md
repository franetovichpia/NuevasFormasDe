# Nuevas Formas De…

Sitio en Next.js con panel de contenidos en `/admin`.

## Desarrollo

```bash
cp .env.example .env.local   # completar contraseñas y NFD_SESSION_SECRET
npm install
npm run dev
```

Sitio: http://localhost:3000 · Panel: http://localhost:3000/admin

## Páginas

- `/`: portada (eventos, propuesta, actividades, entrevistas, equipo, valores, contacto).
- `/entrevistas`: todas las entrevistas con filtros por red social y categoría
  (acepta `?red=youtube&categoria=energias`).
- `/admin`: panel de contenidos. Se accede desde el botón “Ingresar” del sitio.

## Panel de contenidos (`/admin`)

Las rutas `/admin/*` y `/api/admin/*` están protegidas por `proxy.ts`: sin sesión
válida redirigen al ingreso (o responden 401). Cada acción vuelve a verificar la sesión.

| Cuenta | Variables | Puede |
| --- | --- | --- |
| Administración | `NFD_ADMIN_USER`, `NFD_ADMIN_PASSWORD` | Todo, incluido eliminar eventos |
| Usuario (Emiliano) | `NFD_EDITOR_USER`, `NFD_EDITOR_PASSWORD` | Cargar, modificar, publicar, archivar e importar |

- **Eventos:** título, descripción, lugar, enlace, fechas, portada y galería.
  Estados: borrador, publicado o archivado. Todo se puede editar después de publicar.
- **Eventos en el sitio:** se muestran en un calendario (solo se marcan los días con
  eventos: magenta los próximos, azul los realizados) con tarjetas chicas al costado;
  la flecha de cada tarjeta abre el detalle en un modal.
- **Entrevistas desde Google Sheets:** en el panel se pega el enlace de una planilla
  compartida como “Cualquier persona con el enlace · Lector”. El sitio la lee cada
  5 minutos (o al instante con “Actualizar ahora”). Las fotos deben ser enlaces
  (los de Google Drive se convierten solos). Si la planilla falla, se muestra la
  última lista guardada. Categorías nuevas escritas en la planilla se suman como filtros.
- **Entrevistas por archivo:** también se pueden subir con un Excel (.xlsx) o CSV. Columnas:
  `nombre, invitado, info, descripcion, categoria, plataforma, link, foto`.
  Una entrevista puede tener varias categorías separadas por coma
  (`Energías, Arquitectura`).
  El panel permite descargar una plantilla y la lista actual.

## Almacenamiento

- **En Vercel:** crear un Blob store público (Storage → Blob) y conectarlo al
  proyecto. Vercel agrega solo `BLOB_STORE_ID` (o `BLOB_READ_WRITE_TOKEN`); datos e imágenes
  se guardan ahí (con las últimas 10 versiones como respaldo).
- **Sin esas variables:** se guarda en la carpeta local `.content/`.

Mientras no se guarde nada desde el panel, el sitio usa el contenido de
`data/events.ts` y `data/conversations.ts`.
