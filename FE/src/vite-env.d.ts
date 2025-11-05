// src/vite-env.d.ts 또는 vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // 다른 환경변수가 있다면 여기에 추가
  // readonly VITE_OTHER_VAR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}