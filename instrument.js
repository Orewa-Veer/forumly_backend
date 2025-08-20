// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://2c6930f9c9378cf244af3803ad91b83f@o4509849226706944.ingest.de.sentry.io/4509849235030096",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
