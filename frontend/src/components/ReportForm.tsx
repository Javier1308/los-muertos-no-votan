import { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitReport } from '../services/api';
import type { ReportResponse } from '../types/report';

const schema = z
  .object({
    dniDenunciante: z
      .string()
      .length(8, 'El DNI debe tener exactamente 8 dígitos')
      .regex(/^\d{8}$/, 'Solo dígitos numéricos'),
    dniDenunciado: z
      .string()
      .length(8, 'El DNI debe tener exactamente 8 dígitos')
      .regex(/^\d{8}$/, 'Solo dígitos numéricos'),
    mesaVotacion: z
      .string()
      .min(3, 'Mínimo 3 caracteres')
      .max(50, 'Máximo 50 caracteres'),
    parentesco: z.enum(['familiar', 'amigo', 'conocido'], {
      errorMap: () => ({ message: 'Selecciona una opción' }),
    }),
    razon: z.enum(['discapacidad', 'fallecido'], {
      errorMap: () => ({ message: 'Selecciona una opción' }),
    }),
  })
  .refine(data => data.dniDenunciante !== data.dniDenunciado, {
    message: 'El DNI del denunciado no puede ser igual al tuyo',
    path: ['dniDenunciado'],
  });

type FormData = z.infer<typeof schema>;

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, error, required, ...props }, ref) {
    return (
      <div>
        <label className="label">
          {label}
          {required && <span className="text-brand-red ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`input-field ${error ? 'input-error' : ''}`}
          {...props}
        />
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ label, error, required, placeholder, children, ...props }, ref) {
    return (
      <div>
        <label className="label">
          {label}
          {required && <span className="text-brand-red ml-1">*</span>}
        </label>
        <select
          ref={ref}
          className={`input-field bg-white ${error ? 'input-error' : ''}`}
          {...props}
        >
          <option value="">{placeholder ?? 'Selecciona una opción'}</option>
          {children}
        </select>
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

interface ReportFormProps {
  onSuccess: (response: ReportResponse) => void;
  onError: (message: string) => void;
}

export function ReportForm({ onSuccess, onError }: ReportFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await submitReport(data);
      onSuccess(response);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al enviar la denuncia.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Tu DNI (denunciante)"
          type="text"
          inputMode="numeric"
          maxLength={8}
          placeholder="12345678"
          required
          error={errors.dniDenunciante?.message}
          {...register('dniDenunciante')}
        />
        <InputField
          label="DNI del denunciado"
          type="text"
          inputMode="numeric"
          maxLength={8}
          placeholder="87654321"
          required
          error={errors.dniDenunciado?.message}
          {...register('dniDenunciado')}
        />
      </div>

      <InputField
        label="Mesa de votación"
        type="text"
        placeholder="Ej. 123456"
        required
        error={errors.mesaVotacion?.message}
        {...register('mesaVotacion')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField
          label="¿Qué relación tienes con el denunciado?"
          required
          placeholder="Selecciona parentesco"
          error={errors.parentesco?.message}
          {...register('parentesco')}
        >
          <option value="familiar">Familiar</option>
          <option value="amigo">Amigo/a</option>
          <option value="conocido">Conocido/a</option>
        </SelectField>

        <SelectField
          label="Razón de inhabilitación"
          required
          placeholder="Selecciona razón"
          error={errors.razon?.message}
          {...register('razon')}
        >
          <option value="fallecido">Fallecido/a</option>
          <option value="discapacidad">Discapacidad</option>
        </SelectField>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full text-base"
        >
          {isSubmitting ? 'Enviando denuncia...' : 'Enviar denuncia'}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Tu denuncia queda registrada de forma confidencial para ser revisada por las autoridades electorales.
      </p>
    </form>
  );
}
