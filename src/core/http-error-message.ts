function readStringProperty(value: object, key: string) {
  const property = (value as Record<string, unknown>)[key];
  return typeof property === "string" && property.trim() ? property : null;
}

function readFirstValidationError(value: object) {
  const errors = (value as Record<string, unknown>).errors;
  if (typeof errors !== "object" || errors === null) return null;

  for (const fieldErrors of Object.values(errors)) {
    if (typeof fieldErrors === "string" && fieldErrors.trim()) {
      return fieldErrors;
    }
    if (Array.isArray(fieldErrors)) {
      const message = fieldErrors.find(
        (item): item is string => typeof item === "string" && Boolean(item.trim()),
      );
      if (message) return message;
    }
  }

  return null;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null) return fallback;

  return (
    readStringProperty(error, "message") ??
    readStringProperty(error, "detail") ??
    readFirstValidationError(error) ??
    fallback
  );
}
