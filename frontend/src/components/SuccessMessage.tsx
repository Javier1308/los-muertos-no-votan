import type { ReportResponse } from '../types/report';

interface SuccessMessageProps {
  response: ReportResponse;
  onReset: () => void;
}

export function SuccessMessage({ response, onReset }: SuccessMessageProps) {
  return (
    <div className="animate-slide-up text-center space-y-6 py-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Denuncia registrada!</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{response.message}</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-left">
        <p className="text-xs text-gray-500 mb-1">Código de denuncia</p>
        <p className="text-sm font-mono font-semibold text-gray-800 break-all">{response.id}</p>
      </div>

      <button
        onClick={onReset}
        className="text-sm text-brand-red hover:text-brand-red-dark font-medium underline underline-offset-2 transition-colors"
      >
        Registrar otra denuncia
      </button>
    </div>
  );
}
