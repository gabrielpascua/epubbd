class EpubbdError extends Error {
  constructor(params) {
    super(params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EpubbdError);
    }
    this.name = 'EpubbdError';
  }
}

module.exports = EpubbdError;