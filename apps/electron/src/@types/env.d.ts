declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
  }
}

interface ImportMeta {
  env: {
    MODE: 'development' | 'production' | 'preview'
  }
}
