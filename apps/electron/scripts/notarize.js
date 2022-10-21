const { notarize } = require('electron-notarize')

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName === 'darwin') {
    console.log('Notarizing…')
    return await notarize({
      tool: 'notarytool',
      appPath: `${appOutDir}/${context.packager.appInfo.productFilename}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_ID_TEAM_ID,
    })
  }
}
