import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesRepository } from './candidates.repository';
import { CandidatesEntity } from '../../../domain/models/entities/candidates.entity';
import { NameVO } from '../../../domain/models/value-objects/name.vo';
import { SurNameVO } from '../../../domain/models/value-objects/surname.vo';
import { SeniorityVO } from '../../../domain/models/value-objects/seniority.vo';
import { ExperienceVO } from '../../../domain/models/value-objects/experience.vo';
import { AvailabilityVO } from '../../../domain/models/value-objects/availability.vo';
import { SeniorityEnum } from '../../../domain/models/entities/enums/seniority.types';

describe('CandidatesRepository', () => {
  let repository: CandidatesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatesRepository],
    }).compile();

    repository = module.get<CandidatesRepository>(CandidatesRepository);
  });

  describe('save', () => {
    it('should return the candidate entity', async () => {
      const candidate = CandidatesEntity.create(
        new NameVO('Cristian'),
        new SurNameVO('Manuel'),
        new SeniorityVO(SeniorityEnum.senior),
        new ExperienceVO(6),
        new AvailabilityVO(true)
      );

      const result = await repository.save(candidate);

      expect(result).toBe(candidate);
    });
  });

  describe('findByNameAndSurname', () => {
    it('should return null', async () => {
      const result = await repository.findByNameAndSurname('Cristian', 'Manuel');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return empty array', async () => {
      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
