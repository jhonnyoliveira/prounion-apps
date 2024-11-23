import { HttpServer } from './infra/http';
import { Logger, PinoLogger } from './infra/logger';

process.env.TZ = 'America/Sao_Paulo';

const loggerLevel = process.env.LOGGER_INFO ?? 'info';

async function main() {
  const appLogger = new PinoLogger(loggerLevel, 'APP');
  const httpPort = Number(process.env.PORT ?? '8080');

  const httpServer = new HttpServer(new PinoLogger(loggerLevel));

  await configShutdown(appLogger, httpServer);
  await httpServer.start(httpPort);
}

async function configShutdown(logger: Logger, httpServer: HttpServer) {
  enum ExitStatus {
    Failure = 1,
    Success = 0,
  }

  const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

  exitSignals.map((sig) =>
    process.on(sig, async () => {
      try {
        await httpServer.stop();

        logger.info('Existing app with success');
        process.exit(ExitStatus.Success);
      } catch (error) {
        logger.error(error, `App exited with error`);
        process.exit(ExitStatus.Failure);
      }
    }),
  );
}

main();
