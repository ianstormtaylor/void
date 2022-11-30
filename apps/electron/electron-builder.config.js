/** @type {import('electron-builder').Configuration} */
module.exports = {
  // https://www.electron.build/configuration/configuration
  appId: 'com.electron.void',
  productName: 'Void',
  files: ['./out'],
  directories: {
    output: './dist',
    buildResources: './resources',
  },
  // Using ASAR seems to break `esbuild` sadly, need to investigate.
  asar: false,
  // Publishing to GitHub releases for downloading and auto-updating.
  publish: {
    provider: 'github',
    private: true,
  },
  // Mac-specific config.
  mac: {
    target: ['dmg', 'zip'].map((target) => ({
      target,
      arch: ['x64', 'arm64'],
    })),
    artifactName: '${productName}-macOS-${arch}.${ext}',
    category: 'public.app-category.developer-tools',
    // These things seem to be required for signing / opening files.
    hardenedRuntime: true,
    entitlements: './resources/entitlements.mac.plist',
    entitlementsInherit: './resources/entitlements.mac.plist',
  },
  afterSign: 'scripts/notarize.js',
  // Windows-specific config.
  win: {
    target: ['nsis'].map((target) => ({ target, arch: 'x64' })),
    artifactName: '${productName}-Windows-Setup-${arch}.${ext}',
  },
  nsis: {
    perMachine: true,
  },
  // Linux-specific config.
  linux: {
    target: ['appimage'].map((target) => ({ target, arch: 'x64' })),
    artifactName: '${productName}-Linux-${arch}.${ext}',
    category: 'Development',
  },
  // Associated files that will be openable with the app. The `ext` property
  // says it accepts arrays, but that seems to fail on Linux builds.
  fileAssociations: ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs'].map((ext) => ({
    ext,
    name: 'Sketch File',
    role: 'Viewer',
    rank: 'Alternate',
    icon: './resources/icon.png',
  })),
}
