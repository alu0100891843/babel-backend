import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CandidatesDTO } from '../models/dtos/candidates.dto';
import { CandidatesDTOMapper } from '../models/mappers/candidates.dto.mapper';
import { CandidatesEntity } from '../../domain/models/entities/candidates.entity';

@Injectable()
export class CandidatesService {
  constructor() {}

  public createCandidate(candidateDTO: CandidatesDTO, name: string, surname: string): CandidatesDTO {
    const candidateEntity = this.validateCandidateData(candidateDTO, name, surname);
    // if we had a repository, we would persist the entity in the database here
    // For now, we will just return the DTO
    return CandidatesDTOMapper.entityToDTO(candidateEntity);
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
