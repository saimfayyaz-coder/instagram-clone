// Explicit path to the Gradle wrapper so it works on Windows (even with NoDefaultCurrentDirectoryInExePath),
// macOS and Linux CI. A bare "gradlew" only works in some Windows shells.
const GRADLEW = process.platform === 'win32' ? '.\\gradlew.bat' : './gradlew';

/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  // Failure evidence, saved automatically and only for failed tests:
  // screenshots, video, device log (logcat) + Detox log, and the view hierarchy.
  artifacts: {
    rootDir: 'artifacts',
    plugins: {
      screenshot: {
        shouldTakeAutomaticSnapshots: true,
        keepOnlyFailedTestsArtifacts: true,
      },
      video: {
        enabled: true,
        keepOnlyFailedTestsArtifacts: true,
      },
      log: {
        enabled: true,
        keepOnlyFailedTestsArtifacts: true,
      },
      uiHierarchy: 'enabled',
    },
  },
  apps: {
    // "dev" flavor. reactNativeArchitectures is forced to x86_64 because
    // gradle.properties builds arm64-v8a only and the emulator is x86_64.
    'android.dev.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/dev/debug/app-dev-debug.apk',
      testBinaryPath:
        'android/app/build/outputs/apk/androidTest/dev/debug/app-dev-debug-androidTest.apk',
      build: `cd android && ${GRADLEW} assembleDevDebug assembleDevDebugAndroidTest -DtestBuildType=debug -PreactNativeArchitectures=x86_64`,
      reversePorts: [8081],
    },
    'android.dev.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/dev/release/app-dev-release.apk',
      testBinaryPath:
        'android/app/build/outputs/apk/androidTest/dev/release/app-dev-release-androidTest.apk',
      build: `cd android && ${GRADLEW} assembleDevRelease assembleDevReleaseAndroidTest -DtestBuildType=release -PreactNativeArchitectures=x86_64`,
    },
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_7',
      },
    },
  },
  configurations: {
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.dev.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.dev.release',
    },
  },
};
