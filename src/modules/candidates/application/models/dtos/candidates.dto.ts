export class CandidatesDTO {
  name: string;
  surname: string;
  seniority: string;
  experience: number;
  availability: boolean;

  private constructor(
    name: string,
    surname: string,
    seniority: string,
    experience: number,
    availability: boolean
  ) {
    this.name = name;
    this.surname = surname;
    this.seniority = seniority;
    this.experience = experience;
    this.availability = availability;
  }

  public static create(
    name: string,
    surname: string,
    seniority: string,
    experience: number,
    availability: boolean
  ): CandidatesDTO {
    return new CandidatesDTO(name, surname, seniority, experience, availability);
  }

  public static createFromJson(json: Omit<CandidatesDTO, never>): CandidatesDTO {
    return new CandidatesDTO(
      json.name,
      json.surname,
      json.seniority,
      json.experience,
      json.availability
    );
  }
}