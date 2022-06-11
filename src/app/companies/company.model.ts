export interface Company {
  id: number;
  name: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  atlas_provider_id?: number;
  afm: string;
  username?: string;
  password?: string;
}
