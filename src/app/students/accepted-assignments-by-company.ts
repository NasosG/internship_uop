export interface AcceptedAssignmentsByCompany {
  // active applications ranked properties
  app_id: number;
  student_id: number;
  positions: any[];
  application_date: Date;
  applicationDateStr?: string;
  application_status?: boolean;
  approval_state: number;
  sso_name: string;
  lastname?: string;
  firstname?: string;
  reg_code?: string;
  department?: string;
  department_id: number;
  date_of_birth: string;
  gender: number;
  father_name: string;
  father_last_name: string;
  mother_name: string;
  mother_last_name: string;
  score: number;
  mail?: string;
  user_ssn?: string;
  ssn?: string;
  // atlas-position properties
  city: string;
  description: string;
  positionType: string;
  availablePositions: number;
  duration: number;
  physicalObjects: string[];
  providerContactEmail: string;
  providerContactName: string;
  providerContactPhone: string;
  title: string;
  name: string;
  positionGroupLastUpdateString: Date;
  atlasPositionId: number;
  afm?: string;
  period_id?: number;
}
