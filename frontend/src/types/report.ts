export interface ReportResponse {
  id: string;
  message: string;
  created_at: string;
}

export interface ApiError {
  detail: string | { msg: string; loc: string[] }[];
}
