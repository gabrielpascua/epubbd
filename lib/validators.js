const fs = require('fs');
const path = require('path');
const EpubbdError = require('./epubbed-error');
const { getMime } = require('./mime-type');

const validateContent = (options) => {
  const { contents } = options || {};
  if (!contents || !contents.length) {
    throw new EpubbdError('EPUB Contents cannot be empty');
  }
};

const validateFilePath = async function(fileOutputPath) {
  if (fileOutputPath) {
    const pathParts = fileOutputPath.split('/');
    const fileName = pathParts.pop();
    if (fileName.indexOf('.epub') === -1) {
      throw new EpubbdError('Invalid file. Output must use an .epub file extension.');
    }
    const outputDirectory = path.resolve(pathParts.join('/'));
    return new Promise((resolve, reject) => {
      fs.readdir(outputDirectory, (error, files) => {
        if(error) {
          reject(new EpubbdError(error.message));
        }

        resolve(files);
      });
    });
  } else {
    throw new EpubbdError('Generating an EPUB file requires a file path');
  }
};

const validateMimeType = (file, expectedType) => {
  const mime = getMime(file);
  if (!mime || !expectedType.includes(mime.split('/')[1])) {
    throw new EpubbdError(`File type ${file.split('/').pop()} is not supported.`);
  }
};

module.exports = {
  validateContent,
  validateFilePath,
  validateMimeType
};