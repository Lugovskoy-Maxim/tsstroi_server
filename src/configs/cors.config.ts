export const getCorsConfig = () => ({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  maxAge: 86400, // 24 часа
  optionsSuccessStatus: 204,
  preflightContinue: false
});