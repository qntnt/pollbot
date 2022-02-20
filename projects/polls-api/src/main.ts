import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import admin from 'firebase-admin'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { join } from 'path';

admin.initializeApp()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const microservice = app.connectMicroservice(
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:50051',
        package: 'polls',
        protoPath: join(__dirname, 'protos/polls/v1/polls.proto'),
        loader: {
          includeDirs: [
            join(__dirname, 'protos')
          ],
        },
      }
    })
  await app.startAllMicroservices();
  await app.listen(3000)
}
bootstrap();
