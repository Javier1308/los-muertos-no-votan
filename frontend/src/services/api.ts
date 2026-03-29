import type { ReportResponse, ApiError } from '../types/report';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

export interface AdminStats {
  total: number;
  por_parentesco: Record<string, number>;
  por_mesa: Record<string, number>;
}

interface SubmitReportData {
  dniDenunciante: string;
  dniDenunciado: string;
  mesaVotacion: string;
  parentesco: 'familiar' | 'amigo' | 'conocido';
}

export async function submitReport(data: SubmitReportData): Promise<ReportResponse> {
  const payload = {
    dni_denunciante: data.dniDenunciante,
    dni_denunciado: data.dniDenunciado,
    mesa_votacion: data.mesaVotacion,
    parentesco: data.parentesco,
  };

  const res = await fetch(`${API_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json();
    if (res.status === 429) throw new Error('Demasiados envíos. Intenta de nuevo en unos minutos.');
    if (Array.isArray(errorData.detail)) {
      throw new Error(errorData.detail.map(e => e.msg).join(', '));
    }
    throw new Error(String(errorData.detail) || 'Error al enviar la denuncia.');
  }

  return res.json();
}

export async function getAdminStats(apiKey: string): Promise<AdminStats> {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: { 'X-API-Key': apiKey },
  });
  if (!res.ok) {
    const errorData: ApiError = await res.json();
    throw new Error(String(errorData.detail) || 'Error al obtener estadísticas.');
  }
  return res.json();
}

export async function downloadExcel(apiKey: string, parentesco?: string): Promise<void> {
  const params = parentesco ? `?parentesco=${encodeURIComponent(parentesco)}` : '';
  const res = await fetch(`${API_URL}/admin/reports/export/excel${params}`, {
    headers: { 'X-API-Key': apiKey },
  });
  if (!res.ok) {
    const errorData: ApiError = await res.json();
    throw new Error(String(errorData.detail) || 'Error al generar el Excel.');
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', parentesco ? `denuncias_${parentesco}.xlsx` : 'denuncias.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado. Por favor intenta nuevamente.';
}
