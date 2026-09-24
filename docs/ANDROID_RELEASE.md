# Android release

AgriBridge uses Capacitor as a thin native wrapper around the production Next.js origin. This preserves server-side Supabase authentication, RLS, organization authorization and the signed-in entry resolver; no service-role key or provider secret is embedded in the APK.

## Required environment

- `CAPACITOR_SERVER_URL=https://app.your-verified-domain.example`
- `AGRIBRIDGE_APP_LINK_HOST=app.your-verified-domain.example`
- `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` only in protected CI secrets.

Publish `https://<AGRIBRIDGE_APP_LINK_HOST>/.well-known/assetlinks.json` with the production signing certificate SHA-256 fingerprint before releasing. Do not set cleartext HTTP for a release build.

## Commands

```bash
pnpm build
pnpm cap:sync
pnpm cap:android
pnpm android:debug
AGRIBRIDGE_APP_LINK_HOST=app.example.com pnpm android:apk
AGRIBRIDGE_APP_LINK_HOST=app.example.com pnpm android:aab
```

`app-debug.apk` is local testing only. The signed release APK is for controlled direct distribution; the signed AAB is for Google Play and is never offered by the website.

Camera, location, gallery, notifications and biometric unlock must be requested only at the feature that needs them, with user-facing explanation. AgriBridge never requests package-install permission.
