const { notarize } = require('electron-notarize')

exports.default = async function notarizing(context) {
  if (
    // Only notarize on macOS.
    context.electronPlatformName === 'darwin' &&
    // When set to null it's to skip the signing and notarizing step.
    context.packager.platformSpecificBuildOptions.identity !== null
  ) {
    console.log('Notarizing macOS app…')
    return await notarize({
      tool: 'notarytool',
      appPath: `${context.appOutDir}/${context.packager.appInfo.productFilename}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_ID_TEAM_ID,
    })
  }
}
