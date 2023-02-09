export interface ActiveApplicationsRanked {
  app_id: number;
  student_id: number;
  positions: any[];
  application_date: Date;
  applicationDateStr: string;
  application_status: boolean;
  approval_state: number;
  sso_name: string;
  lastname: string;
  firstname: string;
  reg_code: string;
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
  ssn?: string; // AFM
  period_id?: number;
}
