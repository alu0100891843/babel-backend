import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { CandidatesDTO } from '../models/dtos/candidates.dto';
import { CandidatesDTOMapper } from '../models/mappers/candidates.dto.mapper';
import { CandidatesEntity } from '../../domain/models/entities/candidates.entity';
import { CandidateRepositoryInterface } from '../../domain/ports/candidate.repository.interface';

@Injectable()
export class CandidatesService {
  constructor(
    @Inject('CandidateRepositoryInterface')
    private readonly candidateRepository: CandidateRepositoryInterface
  ) {}

  public async createCandidate(candidateDTO: CandidatesDTO, name: string, surname: string): Promise<CandidatesDTO> {
    const candidateEntity = this.validateCandidateData(candidateDTO, name, surname);
    
    const existingCandidate = await this.getCandidateByNameAndSurname(name, surname);
    if (existingCandidate) {
      throw new HttpException(
        'Ya existe un candidato con ese nombre y apellido',
        HttpStatus.CONFLICT,
      );
    }
    
    const savedCandidate = await this.candidateRepository.save(candidateEntity);
    return CandidatesDTOMapper.entityToDTO(savedCandidate);
  }

  public async getAllCandidates(): Promise<CandidatesDTO[]> {
    const candidates = await this.candidateRepository.findAll();
    return CandidatesDTOMapper.entitiesToDTOs(candidates);
  }

  public async getCandidateByNameAndSurname(name: string, surname: string): Promise<CandidatesDTO | null> {
    const candidate = await this.candidateRepository.findByNameAndSurname(name, surname);
    return candidate ? CandidatesDTOMapper.entityToDTO(candidate) : null;
  }

  private validateCandidateData(candidateDTO: CandidatesDTO, name: string, surname: string): CandidatesEntity {
    const candidateEntity = CandidatesDTOMapper.dtoToEntity(candidateDTO);
    if (candidateEntity.name.value !== name || candidateEntity.surname.value !== surname) {
      throw new HttpException(
        'El nombre y apellido del archivo Excel no coinciden con los valores proporcionados',
        HttpStatus.BAD_REQUEST,
      );
    }
    return candidateEntity;
  }
}
