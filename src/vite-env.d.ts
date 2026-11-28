/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend address, e.g. http://localhost:3000. Unset: the site uses its built-in content. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
