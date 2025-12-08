import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { config } from 'dotenv';
import { AppService } from './app.service';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.info(`Porta em uso: ${port}`);

}
bootstrap();
