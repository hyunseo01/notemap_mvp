import { Test, TestingModule } from '@nestjs/testing';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';

describe('PinsController', () => {
  let controller: PinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinsController],
      providers: [PinsService],
    }).compile();

    controller = module.get<PinsController>(PinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
