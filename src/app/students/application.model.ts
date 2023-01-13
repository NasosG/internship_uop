export interface Application {
  id: number;
  student_id: number;
  position_id: number;
  period_id?: number;
  application_date: Date;
  application_status: boolean;
  positions: any[];
}
