import { Test, TestingModule } from '@nestjs/testing';
import { PollsService } from './polls-grpc.controller';

describe('PollsGrpcController', () => {
  let controller: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsService],
    }).compile();

    controller = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
