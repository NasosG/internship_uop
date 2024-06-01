export interface EntryForm {
  // The id of the student the entry form is associated with
  student_id: number;

  // The id of the table - auto incremented
  id: number;

  // Define an index signature that allows for dynamic properties to be added to the object
  // The keys of the dynamic properties can be any string, and their values can be any type
  [key: string]: any;

  creation_date: Date;

  // All fields of entry form - can be used as string properties for specific keys
  A0_1: string;
  A0_2: string;
  A1: string;
  A1_1: string;
  A1_2: string;
  A2: string;
  A2_1: string;
  A2_1_1: string;
  A2_1_2: string;
  A2_1_3: string;
  A2_1_4: string;
  A2_1_5: string;
  A2_1_6: string;
  A2_2: string;
  A2_2_1: string;
  A2_2_2: string;
  A2_2_3: string;
  A2_3: string;
  A2_4: string;
  A3: string;
  A3_1: string;
  A3_1_1: string;
  A3_1_2: string;
  A3_2: string;
  B: string;
  B1: string;
  B2: string;
  B3: string;
  B4: string;
  B5: string;
  B6: string;
  C1: string;
  C2: string;
  C3: string;
  C4: string;
  C5: string;
  C6: string;
  C7: string;
  C8: string;
  C9: string;
  D4: string;
  D5: string;
  D6: string;
  D7: string;
  D8: string;
  D9: string;
  D10: string;
  D11: string;
  D12: string;
  D13: string;
  D14: string;

  // New fields for MIS 21-27
  A2P1: string;
  A2P2: string;
  A2P3: string;
  D1: string;
  D1P: string;
  D2: string;
  D2A: string;
  D2B: string;
  D2C: string;
  D3: string;
  espa_mis: number;
}
