type ErrorWithStatus = {
  status?: number;
  response?: {
    status?: number;
  };
};

export function getHttpErrorStatus(error: unknown) {
  if (!error || typeof error !== "object") return undefined;

  const candidate = error as ErrorWithStatus;
  return candidate.response?.status ?? candidate.status;
}
