export const SeniorityEnum = {
  junior: 'junior',
  senior: 'senior',
} as const;

export type SeniorityEnumType = (typeof SeniorityEnum)[keyof typeof SeniorityEnum];
