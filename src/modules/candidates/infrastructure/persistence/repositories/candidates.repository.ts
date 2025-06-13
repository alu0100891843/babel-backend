import { Injectable } from '@nestjs/common';
import { CandidateRepositoryInterface } from '../../../domain/ports/candidate.repository.interface';
import { CandidatesEntity } from '../../../domain/models/entities/candidates.entity';

@Injectable()
export class CandidatesRepository implements CandidateRepositoryInterface {
  async save(candidate: CandidatesEntity): Promise<CandidatesEntity> {
    await this.simulateLatency();
    return candidate;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findByNameAndSurname(_name: string, _surname: string): Promise<CandidatesEntity | null> {
    await this.simulateLatency();
    return null;
  }

  async findAll(): Promise<CandidatesEntity[]> {
    await this.simulateLatency();
    return [];
  }

  private async simulateLatency(): Promise<void> {
    return new Promise((resolve) => {
      resolve()
    });
  }
}
