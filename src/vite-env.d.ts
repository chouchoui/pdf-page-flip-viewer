/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_TITLE: string;
  VITE_API: string;
  MODE: "development" | "staging" | "production";
}
