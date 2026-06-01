const requiredProductionEnv = [
  'DATABASE_URL',
  'JWT_SECRET',
  'CUSTOMER_WEB_URL',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
];

export function validateEnv() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const missing = requiredProductionEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(', ')}`,
    );
  }
}

export function getCorsOrigins() {
  const configuredOrigins = process.env.CORS_ORIGIN || process.env.CUSTOMER_WEB_URL;

  if (!configuredOrigins) {
    return true;
  }

  return configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
