import { STATUS } from "../constants";

export interface Patient {
  patient_id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  last_visit: Date;
  status: typeof STATUS[number];
  avatar?: string;
}