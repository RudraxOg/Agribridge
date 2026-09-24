# Android release

AgriBridge uses Capacitor as a thin native wrapper around the production Next.js origin. This preserves server-side Supabase authentication, RLS, organization authorization and the signed-in entry resolver; no service-role key or provider secret is embedded in the APK.

## Required environment

- `CAPACITOR_SERVER_URL=https://app.your-verified-domain.example`
- `AGRIBRIDGE_APP_LINK_HOST=app.your-verified-domain.example`
- `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` only in protected CI secrets. The Gradle build decodes the keystore to `ANDROID_KEYSTORE_FILE`; an unsigned release build fails.

Publish `https://<AGRIBRIDGE_APP_LINK_HOST>/.well-known/assetlinks.json` with the production signing certificate SHA-256 fingerprint before releasing. Do not set cleartext HTTP for a release build.

The production signing certificate fingerprint is `AB:75:23:40:F2:2C:A4:CC:E3:46:E9:66:B9:78:BB:A3:1D:C9:D4:CF:79:C8:12:48:66:EB:CA:AA:8A:71:67:B9`. Keep the signing key and passwords safe: Android updates must use the same key. GitHub Actions secrets hold the key and passwords for repeatable builds; they are never committed to Git.

## Commands

```bash
pnpm build
pnpm cap:sync
pnpm cap:android
pnpm android:debug
CAPACITOR_SERVER_URL=https://app.example.com AGRIBRIDGE_APP_LINK_HOST=app.example.com ANDROID_KEYSTORE_FILE=/secure/path/release.jks pnpm android:apk
CAPACITOR_SERVER_URL=https://app.example.com AGRIBRIDGE_APP_LINK_HOST=app.example.com ANDROID_KEYSTORE_FILE=/secure/path/release.jks pnpm android:aab
```

`app-debug.apk` is local testing only. The signed release APK is for controlled direct distribution; the signed AAB is for Google Play and is never offered by the website.

For the GitHub-hosted APK, run the **Android release APK** workflow, verify its signed artifact and SHA-256, then publish the APK as a GitHub Release asset. Update the website's release manifest only after the asset is publicly accessible.

Camera, location, gallery, notifications and biometric unlock must be requested only at the feature that needs them, with user-facing explanation. AgriBridge never requests package-install permission.
