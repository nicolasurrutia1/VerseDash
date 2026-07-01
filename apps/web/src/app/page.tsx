import { SHARED_PACKAGE_VERSION } from '@verse-dash/shared';

export default function Home() {
  return (
    <main>
      <h1>VerseDash</h1>
      <p>Shared package version: {SHARED_PACKAGE_VERSION}</p>
    </main>
  );
}
