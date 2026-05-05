import { ApiError } from './client';

const lowerFirst = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

export const fieldErrors = (err) => {
  if (!(err instanceof ApiError)) return {};
  const body = err.body;
  if (!body || typeof body !== 'object' || !body.errors) return {};
  const out = {};
  for (const [key, value] of Object.entries(body.errors)) {
    const messages = Array.isArray(value) ? value : [String(value)];
    out[lowerFirst(key)] = messages;
  }
  return out;
};

export const generalErrorMessage = (err) => {
  if (err instanceof ApiError) {
    const body = err.body;
    if (typeof body === 'string') return body || err.message;
    if (body && typeof body === 'object') {
      return body.title ?? body.detail ?? body.message ?? err.message;
    }
    return err.message;
  }
  return err?.message ?? 'Unknown error';
};
