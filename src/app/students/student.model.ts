export interface Student {
  id: string;
  sn: string;
  givenname: string;
  edupersonaffiliation: string;
  edupersonprimaryaffiliation: string;
  edupersonorgdn: string;
  edupersonentitlement: string;
  // schacpersonaluniquecode:"urn: mace: terena.org: schac: personalUniqueCode: gr: uop.gr: 98: 2022201902003",
  schacgender: number;
  schacyearofbirth: number;
  schacdateofbirth: string;
  schacpersonaluniqueid: string;
  city: string;
  ssn: string;
  skills: string;
  post_address: string;
  phone: string;
  other_edu: string;
  mother_name: string;
  mother_last_name: string;
  location: string;
  languages: string;
  interests: string;
  iban: string;
  honors: string;
  father_name: string;
  father_last_name: string;
  experience: string;
  education: string;
  doy: string;
  country: string;
  computer_skills: string;
  address: string;
}
