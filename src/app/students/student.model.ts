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
}
