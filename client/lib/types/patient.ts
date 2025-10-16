import { GENDER, STATUS } from "../constants";

export interface Patient {
  patient_id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: typeof GENDER[number];
  status: typeof STATUS[number];
  avatar?: string;
  medical_history?: string;
}