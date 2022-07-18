export interface Period {
  id: number,
  sso_user_id: number,
  available_positions: number,
  pyear: number,
  semester: number,
  phase_state: number,
  date_from: Date,
  date_to: Date,
  is_active: boolean
  positions: number
}
