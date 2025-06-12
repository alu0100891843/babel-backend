import { AvailabilityVO } from "../value-objects/availability.vo";
import { ExperienceVO } from "../value-objects/experience.vo";
import { NameVO } from "../value-objects/name.vo";
import { SeniorityVO } from "../value-objects/seniority.vo";
import { SurNameVO } from "../value-objects/surname.vo";

export class CandidatesEntity {
  readonly name: NameVO;
  readonly surname: SurNameVO;
  readonly seniority: SeniorityVO;
  readonly experience: ExperienceVO;
  readonly availability: AvailabilityVO;

  private constructor(
    name: NameVO,
    surname: SurNameVO,
    seniority: SeniorityVO,
    experience: ExperienceVO,
    availability: AvailabilityVO
  ) {
    this.name = name;
    this.surname = surname;
    this.seniority = seniority;
    this.experience = experience;
    this.availability = availability;
  }

  static create(
    name: NameVO,
    surname: SurNameVO,
    seniority: SeniorityVO,
    experience: ExperienceVO,
    availability: AvailabilityVO
  ): CandidatesEntity {
    return new CandidatesEntity(name, surname, seniority, experience, availability);
  }
}
