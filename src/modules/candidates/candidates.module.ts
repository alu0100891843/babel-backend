import { Module } from '@nestjs/common';
import { CandidatesController } from './infrastructure/controllers/candidates.controller';
import { CandidatesService } from './application/services/candidates.service';
import { CandidatesRepository } from './infrastructure/persistence/repositories/candidates.repository';

@Module({
  controllers: [CandidatesController],
  providers: [
    CandidatesService,
    {
      provide: 'CandidateRepositoryInterface',
      useClass: CandidatesRepository,
    },
  ],
  exports: [CandidatesService],
})
export class CandidatesModule {}

