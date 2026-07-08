const required = (name, fallback) => {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
};

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: required("PORT", 5000),

  MONGODB_URI: required("MONGODB_URI"),
  DB_NAME: process.env.DB_NAME,

  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:4200",

  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",

  MAX_UPLOAD_MB: Number(process.env.MAX_UPLOAD_MB) || 5,
};
