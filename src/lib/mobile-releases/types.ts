export type AndroidRelease = {
  id: string;
  version: string;
  versionCode: number;
  fileSizeBytes: number;
  minAndroidSdk: number;
  sha256: string;
  releaseNotes: string[];
  publishedAt: string;
  downloadUrl: string;
};
export type AndroidReleaseState = {
  release: AndroidRelease | null;
  unavailable: boolean;
};
