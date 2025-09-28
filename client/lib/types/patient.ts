import { GENDER, STATUS } from "../constants";

export interface Patient {
  patient_id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  gender: typeof GENDER[number];
  last_visit: string;
  status: typeof STATUS[number];
  avatar?: string;
  medical_history?: string;
}