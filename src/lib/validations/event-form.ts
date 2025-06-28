import { z } from 'zod';

// Time validation helper
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const dayAvailabilitySchema = z
  .object({
    enabled: z.boolean(),
    startTime: z.string().regex(timeRegex, 'Formato de hora inválido (HH:MM)'),
    endTime: z.string().regex(timeRegex, 'Formato de hora inválido (HH:MM)'),
  })
  .refine(
    data => {
      if (!data.enabled) return true;

      const start = new Date(`1970-01-01T${data.startTime}:00`);
      const end = new Date(`1970-01-01T${data.endTime}:00`);

      return start < end;
    },
    {
      message: 'Horário de início deve ser anterior ao horário de fim',
      path: ['endTime'], // Error will be shown on endTime field
    }
  );

export const weekdaysSchema = z
  .object({
    monday: dayAvailabilitySchema,
    tuesday: dayAvailabilitySchema,
    wednesday: dayAvailabilitySchema,
    thursday: dayAvailabilitySchema,
    friday: dayAvailabilitySchema,
    saturday: dayAvailabilitySchema,
    sunday: dayAvailabilitySchema,
  })
  .refine(
    data => {
      // At least one day must be enabled
      return Object.values(data).some(day => day.enabled);
    },
    {
      message: 'Pelo menos um dia da semana deve ser habilitado',
      path: ['monday'], // Show error on first day for visibility
    }
  );

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres')
    .trim(),

  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional()
    .transform(val => val?.trim() || undefined),

  duration: z
    .number()
    .min(15, 'Duração mínima é 15 minutos')
    .max(480, 'Duração máxima é 8 horas (480 minutos)')
    .refine(val => val % 15 === 0, 'Duração deve ser múltipla de 15 minutos'),

  weekdays: weekdaysSchema,
});

export type EventFormData = z.infer<typeof eventFormSchema>;
export type DayAvailabilityData = z.infer<typeof dayAvailabilitySchema>;

// Helper function to get validation error messages
export const getValidationErrorMessage = (
  error: z.ZodError
): Record<string, string> => {
  const errors: Record<string, string> = {};

  error.errors.forEach(err => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });

  return errors;
};

// Helper function to validate individual fields
export const validateField = (
  fieldName: keyof EventFormData,
  value: unknown
): string | undefined => {
  try {
    const fieldSchema = eventFormSchema.shape[fieldName];
    fieldSchema.parse(value);
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return 'Erro de validação';
  }
};

// Default form values
export const defaultEventFormValues: EventFormData = {
  title: '',
  description: '',
  duration: 30,
  weekdays: {
    monday: { enabled: false, startTime: '08:00', endTime: '17:00' },
    tuesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
    wednesday: { enabled: false, startTime: '08:00', endTime: '17:00' },
    thursday: { enabled: false, startTime: '08:00', endTime: '17:00' },
    friday: { enabled: false, startTime: '08:00', endTime: '17:00' },
    saturday: { enabled: false, startTime: '10:00', endTime: '13:00' },
    sunday: { enabled: false, startTime: '10:00', endTime: '13:00' },
  },
};
