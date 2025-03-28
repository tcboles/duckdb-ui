// build/notarize.js
import { notarize } from 'electron-notarize';

export default async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  process.env.ELECTRON_NOTARIZE_USE_NOTARYTOOL = 'true';

  if (electronPlatformName !== 'darwin') {
    console.log('Not a macOS build. Skipping notarization.');
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  const { APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID } = process.env;

  if (!APPLE_ID || !APPLE_APP_SPECIFIC_PASSWORD || !APPLE_TEAM_ID) {
    console.error(
      '❌ Missing Apple credentials. Make sure APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, and APPLE_TEAM_ID are set.'
    );
    process.exit(1);
  }

  console.log(`🔐 Notarizing ${appPath}...`);

  try {
    await notarize({
      appBundleId: 'com.tcboles.duckdb',
      appPath,
      appleId: APPLE_ID,
      appleIdPassword: APPLE_APP_SPECIFIC_PASSWORD,
      teamId: APPLE_TEAM_ID,
      tool: 'notarytool'
    });

    console.log('✅ Notarization complete!');
  } catch (error) {
    console.error('❌ Notarization failed:');
    console.error(error);
    process.exit(1);
  }
}
