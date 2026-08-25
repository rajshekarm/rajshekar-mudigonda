# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Blog Data Structure

The frontend supports blog content in two ways:

1. `sections` (preferred, hierarchical)
2. `content` markdown fallback (used when `sections` is empty)

### Blog shape

```ts
type BlogSection = {
  id: string
  title: string
  level: 1 | 2 | 3
  content?: string
  image_url?: string
  image_alt?: string
  children?: BlogSection[]
}

type Blog = {
  id: string
  slug: string
  title: string
  subheader?: string
  description: string
  content?: string
  external_url?: string
  status: "draft" | "published"
  tags?: string[]
  sections?: BlogSection[]
  created_at: string
  updated_at: string
}
```

### Section hierarchy

1. `level: 1` -> parent section
2. `level: 2` -> subsection of level 1
3. `level: 3` -> child section of level 2

### Example JSON

```json
{
  "id": "b1",
  "slug": "sample-blog",
  "title": "Sample Blog",
  "subheader": "How section levels work",
  "description": "Demo of level 1, 2, 3",
  "status": "published",
  "tags": ["demo"],
  "sections": [
    {
      "id": "s1",
      "title": "System Overview",
      "level": 1,
      "content": "High-level architecture and goals.",
      "children": [
        {
          "id": "s1-1",
          "title": "API Layer",
          "level": 2,
          "content": "Handles routing, validation, and auth.",
          "children": [
            {
              "id": "s1-1-1",
              "title": "Rate Limiting",
              "level": 3,
              "content": "Protects APIs from abuse.",
              "children": []
            }
          ]
        }
      ]
    }
  ],
  "created_at": "2026-02-14T00:00:00Z",
  "updated_at": "2026-02-14T00:00:00Z"
}
```

## Current Blog UI Behavior

## Local Blog API

The block-based blog editor uses a SQLAlchemy-backed Python API. Install its
dependency and start it from the project directory:

```powershell
python -m pip install -r .\api\requirements.txt
python .\api\blog_server.py
```

The API listens at `http://127.0.0.1:8080/api/blogs` and uses the SQLite
database at `api/storage/blogs.db`. Existing records from `blogs.json` are
imported automatically when the SQL database is empty. Set `VITE_BLOG_API_URL`
to use a different frontend endpoint.

Set `BLOG_DATABASE_URL` to use another SQLAlchemy-supported database. For
example, after installing a PostgreSQL driver:

```powershell
$env:BLOG_DATABASE_URL = "postgresql+psycopg://user:password@host/blogs"
python .\api\blog_server.py --host 0.0.0.0
```

- `POST /api/blogs` creates a blog.
- `GET /api/blogs` lists stored blogs.
- `GET /api/blogs/{slug}` returns one stored blog.
- `PUT /api/blogs/{slug}` updates mutable blog fields.
- `DELETE /api/blogs/{slug}` deletes a blog.

### `/blogs/new`

1. Minimal by default: `title` and `description`.
2. `slug` is auto-generated from `title` unless set in `Advanced`.
3. `Sections` panel supports adding top-level section objects with `+ Add Section`.
4. New sections default to `level: 2`.
5. Section content textareas auto-expand while typing.
6. Each section can optionally attach an image from the local computer and store alt text.
7. Optional fields (`subheader`, `content`, `tags`, `status`, `external_url`) are in `Advanced`.

### `/blogs/:slug` edit mode

1. Parent/blog fields are editable (`title`, `subheader`, `description`).
2. Existing sections are shown read-only in edit mode.
3. `+ Add Section` opens a separate "New Section" input area.
4. New section can optionally include an uploaded image and alt text.
5. New section is appended only when `Add This Section` is clicked.

## Frontend API Contract

### Create

- Endpoint: `POST /api/blogs/`
- Sent fields:
  - `slug`
  - `title`
  - `subheader?`
  - `description`
  - `status`
  - `content?`
  - `external_url?`
  - `tags?`
  - `sections?`

### Update

- Endpoint: `PUT /api/blogs/{slug}`
- Sent fields:
  - `slug`
  - `title`
  - `subheader?`
  - `description`
  - `content?`
  - `external_url?`
  - `status`
  - `tags?`
  - `sections`

## Backend DTO Recommendation

Use separate schemas:

1. `BlogCreateRequestDTO`: request payload for `POST` (no `id/created_at/updated_at`).
2. `BlogUpdateRequestDTO`: request payload for `PUT` (partial or full fields).
3. `BlogResponseDTO`: response payload (includes `id`, `created_at`, `updated_at`).
