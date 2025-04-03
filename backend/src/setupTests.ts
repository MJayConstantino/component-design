if (process.env.NODE_ENV === 'test') {
  throw new Error('Test environment is not set up correctly. Please check your configuration.');
}