export type DataProps = {
  patient_id: number;
  patient_name: string;
  age: number;
  photo_url: string | null;
  contact:
    | {
        address: string;
        number: string;
        email: string;
      }[]
    | null;
  medical_issue: string | null;
};
