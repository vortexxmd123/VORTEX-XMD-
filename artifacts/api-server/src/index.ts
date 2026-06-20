import app from "./app";
import { logger } from "./lib/logger";
import { loadAllPlugins } from "./lib/commandLoader";
import { restoreAllSessions } from "./lib/sessionManager";
import { seedDefaults } from "./lib/seed";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, async (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  try {
    await seedDefaults();
  } catch (e) {
    logger.error({ e }, "Seed failed");
  }

  try {
    await loadAllPlugins();
    logger.info("All plugins loaded");
  } catch (e) {
    logger.error({ e }, "Failed to load plugins");
  }

  try {
    await restoreAllSessions();
    logger.info("Sessions restore initiated");
  } catch (e) {
    logger.error({ e }, "Failed to restore sessions");
  }
});
