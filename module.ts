import { Module } from '@nestjs/common';

import { ValkeyModule } from '@toxicoder/nestjs-valkey';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ValkeyModule.forRoot({
      host: 'localhost',
      port: 6379,
      keyPrefix: 'qualle:fieldcontrol-chamados:',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
