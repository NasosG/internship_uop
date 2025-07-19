export interface EvaluationForm {
  id?: number;
  student_id: number;
  digital_signature?: string;
  answers: {
    question_id: number;
    answer: string | number;
  }[];
}