export type Parentesco = 'familiar' | 'amigo' | 'conocido';
export type Razon = 'discapacidad' | 'fallecido';

export interface ReportFormData {
  dniDenunciante: string;
  dniDenunciado: string;
  mesaVotacion: string;
  parentesco: Parentesco | '';
  razon: Razon | '';
}

export interface ReportResponse {
  id: string;
  message: string;
  created_at: string;
}

export interface ApiError {
  detail: string | { msg: string; loc: string[] }[];
}
