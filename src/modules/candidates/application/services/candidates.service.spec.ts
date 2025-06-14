import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidateRepositoryInterface } from '../../domain/ports/candidate.repository.interface';
import { CandidatesEntity } from '../../domain/models/entities/candidates.entity';
import { CandidatesDTO } from '../models/dtos/candidates.dto';
import { NameVO } from '../../domain/models/value-objects/name.vo';
import { SurNameVO } from '../../domain/models/value-objects/surname.vo';
import { SeniorityVO } from '../../domain/models/value-objects/seniority.vo';
import { ExperienceVO } from '../../domain/models/value-objects/experience.vo';
import { AvailabilityVO } from '../../domain/models/value-objects/availability.vo';
import { SeniorityEnum } from '../../domain/models/entities/enums/seniority.types';

describe('CandidatesService', () => {
  let service: CandidatesService;
  let mockRepository: jest.Mocked<CandidateRepositoryInterface>;

  const mockCandidateEntity = CandidatesEntity.create(
    new NameVO('Cristian'),
    new SurNameVO('Manuel'),
    new SeniorityVO(SeniorityEnum.senior),
    new ExperienceVO(6),
    new AvailabilityVO(true)
  );

  const mockCandidateDTO = CandidatesDTO.create('Cristian', 'Manuel', 'senior', 6, true);

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      findByNameAndSurname: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatesService,
        {
          provide: 'CandidateRepositoryInterface',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCandidate', () => {
    it('should create a candidate successfully', async () => {
      mockRepository.findByNameAndSurname.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(mockCandidateEntity);

      const result = await service.createCandidate(mockCandidateDTO, 'Cristian', 'Manuel');

      expect(result).toEqual(mockCandidateDTO);
      expect(mockRepository.findByNameAndSurname).toHaveBeenCalledWith('Cristian', 'Manuel');
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(CandidatesEntity));
    });

    it('should throw conflict error when candidate already exists', async () => {
      mockRepository.findByNameAndSurname.mockResolvedValue(mockCandidateEntity);

      await expect(
        service.createCandidate(mockCandidateDTO, 'Cristian', 'Manuel')
      ).rejects.toThrow(
        new HttpException(
          'Ya existe un candidato con ese nombre y apellido',
          HttpStatus.CONFLICT
        )
      );

      expect(mockRepository.findByNameAndSurname).toHaveBeenCalledWith('Cristian', 'Manuel');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw bad request when name and surname do not match', async () => {
      mockRepository.findByNameAndSurname.mockResolvedValue(null);

      await expect(
        service.createCandidate(mockCandidateDTO, 'Pepe', 'Pérez')
      ).rejects.toThrow(
        new HttpException(
          'El nombre y apellido del archivo Excel no coinciden con los valores proporcionados',
          HttpStatus.BAD_REQUEST
        )
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw bad request when only name does not match', async () => {
      mockRepository.findByNameAndSurname.mockResolvedValue(null);

      await expect(
        service.createCandidate(mockCandidateDTO, 'Pepe', 'Manuel')
      ).rejects.toThrow(
        new HttpException(
          'El nombre y apellido del archivo Excel no coinciden con los valores proporcionados',
          HttpStatus.BAD_REQUEST
        )
      );
    });

    it('should throw bad request when only surname does not match', async () => {
      mockRepository.findByNameAndSurname.mockResolvedValue(null);

      await expect(
        service.createCandidate(mockCandidateDTO, 'Cristian', 'Pérez')
      ).rejects.toThrow(
        new HttpException(
          'El nombre y apellido del archivo Excel no coinciden con los valores proporcionados',
          HttpStatus.BAD_REQUEST
        )
      );
    });
  });

  describe('getCandidateByNameAndSurname', () => {
    it('should return candidate DTO when found', async () => {
      mockRepository.findByNameAndSurname.mockResolvedValue(mockCandidateEntity);

      const result = await service.getCandidateByNameAndSurname('Cristian', 'Manuel');

      expect(result).toEqual(mockCandidateDTO);
      expect(mockRepository.findByNameAndSurname).toHaveBeenCalledWith('Cristian', 'Manuel');
    });

    it('should return null when candidate not found', async () => {
      mockRepository.findByNameAndSurname.mockResolvedValue(null);

      const result = await service.getCandidateByNameAndSurname('Pepe', 'Pérez');

      expect(result).toBeNull();
      expect(mockRepository.findByNameAndSurname).toHaveBeenCalledWith('Pepe', 'Pérez');
    });
  });

  describe('edge cases and error handling', () => {

    it('should handle empty strings in name validation', async () => {
      const invalidDTO = CandidatesDTO.create('', 'Manuel', 'senior', 6, true);
      mockRepository.findByNameAndSurname.mockResolvedValue(null);

      await expect(
        service.createCandidate(invalidDTO, '', 'Manuel')
      ).rejects.toThrow('El nombre es requerido');
    });
  });
});
