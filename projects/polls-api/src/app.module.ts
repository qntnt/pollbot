import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PollsService } from './polls-grpc/polls-grpc.controller';
import { PollsRestController } from './polls-rest/polls-rest.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POLLS_PACKAGE',
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
          
        },
      },
    ]),
  ],
  controllers: [PollsService, PollsRestController],
  providers: [],
})
export class AppModule {}
