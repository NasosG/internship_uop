export interface Assignment {
  position_id?: number;
  internal_position_id?: number;
  title: string;
  city: string;
  duration: number;
  physical_object: string[];
  student_id: number;
  approval_state?: number;
  department_id?: number;
  period_id?: number;
}
