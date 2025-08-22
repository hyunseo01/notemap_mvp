import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    const t = Date.now();
    res.on('finish', () => {
      console.log(
        `[REQ] ${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - t}ms)`,
      );
    });
    next();
  });

  const express = app.getHttpAdapter().getInstance();
  express.get('/', (_req, res) => {
    res.json({ ok: true, msg: 'hello world (raw)' });
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, '0.0.0.0');
  console.log('[BOOT] listening on', port);
}
bootstrap();
