// utils/logger.js

const isDev = process.env.NODE_ENV !== 'production';

const log = (...args) => {
  if (isDev) console.log('[LOG]', ...args);
};

const warn = (...args) => {
  if (isDev) console.warn('[WARN]', ...args);
};

const error = (...args) => {
  console.error('[ERROR]', ...args); // always log errors
};

module.exports = { log, warn, error };
