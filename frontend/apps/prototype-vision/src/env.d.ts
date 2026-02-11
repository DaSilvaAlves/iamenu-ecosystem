/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMMUNITY_API_URL?: string;
  readonly VITE_MARKETPLACE_API_URL?: string;
  readonly VITE_BUSINESS_API_URL?: string;
  readonly VITE_ACADEMY_API_URL?: string;
  readonly VITE_TAKEAWAY_API_URL?: string;
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
