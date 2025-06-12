import { SeniorityEnum, SeniorityEnumType } from "src/modules/candidates/domain/models/entities/enums/seniority.types";
import { CandidatesEntity } from "../../../domain/models/entities/candidates.entity";
import { AvailabilityVO } from "../../../domain/models/value-objects/availability.vo";
import { ExperienceVO } from "../../../domain/models/value-objects/experience.vo";
import { NameVO } from "../../../domain/models/value-objects/name.vo";
import { SeniorityVO } from "../../../domain/models/value-objects/seniority.vo";
import { SurNameVO } from "../../../domain/models/value-objects/surname.vo";
import { CandidatesDTO } from "../dtos/candidates.dto";

export class CandidatesDTOMapper {
  
  static entityToDTO(entity: CandidatesEntity): CandidatesDTO {
    return CandidatesDTO.create(
      entity.name.value,
      entity.surname.value,
      entity.seniority.value,
      entity.experience.value,
      entity.availability.value
    );
  }

  static dtoToEntity(dto: CandidatesDTO): CandidatesEntity {
    const name = new NameVO(dto.name);
    const surname = new SurNameVO(dto.surname);
    const seniority = new SeniorityVO(SeniorityEnum[dto.seniority as SeniorityEnumType])
    const experience = new ExperienceVO(dto.experience);
    const availability = new AvailabilityVO(dto.availability);

    return CandidatesEntity.create(
      name,
      surname,
      seniority,
      experience,
      availability
    );
  }

  static entitiesToDTOs(entities: CandidatesEntity[]): CandidatesDTO[] {
    return entities.map(entity => this.entityToDTO(entity));
  }

  static dtosToEntities(dtos: CandidatesDTO[]): CandidatesEntity[] {
    return dtos.map(dto => this.dtoToEntity(dto));
  }
}
