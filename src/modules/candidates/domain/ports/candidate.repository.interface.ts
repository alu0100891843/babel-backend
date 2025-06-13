import { CandidatesEntity } from '../models/entities/candidates.entity';

export interface CandidateRepositoryInterface {
  save(candidate: CandidatesEntity): Promise<CandidatesEntity>;
  findByNameAndSurname(name: string, surname: string): Promise<CandidatesEntity | null>;
  findAll(): Promise<CandidatesEntity[]>;
}
