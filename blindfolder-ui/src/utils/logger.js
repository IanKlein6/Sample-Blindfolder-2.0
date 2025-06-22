// src/utils/logger.js

const isDev = process.env.NODE_ENV === 'development';

const log = (...args) => {
  if (isDev) console.log('[LOG]', ...args);
};

const warn = (...args) => {
  if (isDev) console.warn('[WARN]', ...args);
};

const error = (...args) => {
  if (isDev) {
    console.error('[ERROR]', ...args);
  } else {
    // In production, still log errors
    console.error('[ERROR]', ...args);
  }
};

module.exports = { log, warn, error };
