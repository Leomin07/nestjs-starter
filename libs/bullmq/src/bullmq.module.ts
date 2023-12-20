import { Module } from '@nestjs/common';
import { BullmqService } from './bullmq.service';

@Module({
  imports: [],
  providers: [BullmqService],
  exports: [BullmqService],
})
export class BullmqModule {}
