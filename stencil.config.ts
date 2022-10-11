import { Config } from '@stencil/core'

export const config: Config = {
  enableCache: true,
  hashFileNames: false,
  autoprefixCss: false,
  minifyCss: true,
  hashedFileNameLength: 8,
  extras: {
    // We need the following for IE11 and old Edge:
    cssVarsShim: true,
    dynamicImportShim: true,
    // We don’t use shadow DOM so this is not needed:
    shadowDomShim: false,
    // Setting the below option to “true” will actually break Safari 10 support:
    safari10: false,
    // This is to tackle an Angular specific performance issue:
    initializeNextTick: true,
    // Don’t need any of these so setting them to “false”:
    scriptDataOpts: false,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: false,
    experimentalImportInjection: true,
  },
  buildEs5: 'prod',
  namespace: 'cron-picker',
  taskQueue: 'async',
  plugins: [],
  outputTargets: [
    {
      type: 'dist-custom-elements',
      dir: 'custom-element',
      autoDefineCustomElements: true,
      empty: true,
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
}
