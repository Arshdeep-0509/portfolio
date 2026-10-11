/**
 * SVGO settings for /public (run: pnpm svg:optimize). Keeps viewBox and width/height so every
 * illustration keeps its intrinsic size and aspect ratio, and keeps ids used by gradients.
 */
const config = {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: { overrides: { removeViewBox: false, cleanupIds: false } },
    },
  ],
};

export default config;
