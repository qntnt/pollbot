import { Test, TestingModule } from '@nestjs/testing';
import { PollsRestController } from './polls-rest.controller';

describe('PollsRestController', () => {
  let controller: PollsRestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsRestController],
    }).compile();

    controller = module.get<PollsRestController>(PollsRestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
