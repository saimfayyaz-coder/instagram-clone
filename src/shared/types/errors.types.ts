// FormFieldError removed — react-hook-form owns field error state internally

export type AppError = {
  message: string;                       // Already translated, ready to display
  code?: string;                         // Server error code e.g. 'INVALID_CREDENTIALS'
  status?: number;                       // HTTP status for debugging
  fieldErrors?: Record<string, string>;  // Flattened field errors from server
};
