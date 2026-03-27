import { useState } from 'react';
import { ReportForm } from './components/ReportForm';
import { SuccessMessage } from './components/SuccessMessage';
import { ErrorMessage } from './components/ErrorMessage';
import type { ReportResponse } from './types/report';

function PeruFlag() {
  return (
    <div className="flex gap-0.5 items-center" aria-hidden="true">
      <div className="w-3 h-5 bg-brand-red rounded-sm" />
      <div className="w-3 h-5 bg-white border border-gray-200 rounded-sm" />
      <div className="w-3 h-5 bg-brand-red rounded-sm" />
    </div>
  );
}

type AppState = 'idle' | 'success';

export default function App() {
  const [state, setState] = useState<AppState>('idle');
  const [successResponse, setSuccessResponse] = useState<ReportResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccess = (response: ReportResponse) => {
    setSuccessResponse(response);
    setState('success');
    setErrorMessage(null);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  const handleReset = () => {
    setState('idle');
    setSuccessResponse(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <PeruFlag />
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            LOS MUERTOS <span className="text-brand-red">NO</span> VOTAN
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gray-900 text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-red/20 text-brand-red-light border border-brand-red/30 rounded-full px-4 py-1.5 text-base font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            Denuncia ciudadana
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Reporta irregularidades en el padrón electoral
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Ningún fallecido debe estar habilitado para votar.
          </p>
        </div>
      </section>

      {/* Wave divider */}
      <div className="bg-gray-900">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
          <path d="M0 48L1440 48L1440 0C1200 40 960 48 720 48C480 48 240 40 0 0L0 48Z" fill="#f9fafb" />
        </svg>
      </div>

      {/* Form section */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {state === 'success' && successResponse ? (
              <SuccessMessage response={successResponse} onReset={handleReset} />
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Registrar denuncia
                  </h2>
                  <p className="text-sm text-gray-500">
                    Todos los campos son obligatorios. Tu identidad queda protegida.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-5">
                    <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} />
                  </div>
                )}

                <ReportForm onSuccess={handleSuccess} onError={handleError} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Info section */}
      <section className="py-12 px-4 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Identifica',
                desc: 'Detecta que una persona fallecida o con discapacidad aparece en el padrón electoral.',
              },
              {
                step: '2',
                title: 'Denuncia',
                desc: 'Completa el formulario con los datos del DNI y la mesa de votación correspondiente.',
              },
              {
                step: '3',
                title: 'Protege',
                desc: 'Tu reporte se registra y queda disponible para que las autoridades electorales actúen.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-brand-red text-white font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <PeruFlag />
            <span className="font-semibold text-white">LOS MUERTOS NO VOTAN</span>
          </div>
          <p>Plataforma ciudadana por la integridad electoral — Perú</p>
        </div>
      </footer>
    </div>
  );
}
