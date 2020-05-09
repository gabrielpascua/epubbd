class EpubbedError extends Error {
  constructor(params) {
    super(params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EpubbedError);
    }
    this.name = 'EpubbedError';
  }
}

module.exports = EpubbedError;