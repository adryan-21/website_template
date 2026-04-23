import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const astroPackageJsonPath = require.resolve('astro/package.json');
const astroPackageRoot = dirname(astroPackageJsonPath);
const astroDevEntrypoint = pathToFileURL(resolve(astroPackageRoot, 'dist/core/dev/dev.js')).href;
const { default: startAstroDev } = await import(astroDevEntrypoint);

const server = await startAstroDev({
  root: projectRoot,
  server: {
    host: true,
  },
});

const shutdown = async () => {
  await server?.stop();
  process.exit(0);
};

process.on('SIGINT', () => {
  void shutdown();
});

process.on('SIGTERM', () => {
  void shutdown();
});

await new Promise(() => {});
