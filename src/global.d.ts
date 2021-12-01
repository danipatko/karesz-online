/// <reference types="@sveltejs/kit" />
interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly VITE_DATABASE_HOSTNAME:string;
    readonly VITE_DATABASE_USER:string;
    readonly VITE_DATABASE_PASSWORD:string;
    readonly VITE_DATABASE_PORT:number;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}
