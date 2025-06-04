import { Module } from '@nestjs/common';
import { CandidatesController } from './infrastructure/controllers/candidates.controller';
import { CandidatesService } from './application/services/candidates.service';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService]
})
export class CandidatesModule {}
