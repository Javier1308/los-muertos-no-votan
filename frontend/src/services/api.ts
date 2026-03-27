import type { ReportResponse, ApiError } from '../types/report';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

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
