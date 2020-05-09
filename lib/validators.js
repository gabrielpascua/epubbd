const fs = require('fs');
const path = require('path');
const EpubbedError = require('./epubbed-error');

const validateContent = (options) => {
  const { contents } = options || {};
  if (!contents || !contents.length) {
    throw new EpubbedError('EPUB Contents cannot be empty');
  }
};

const validateFilePath = async function(fileOutputPath) {
  if (fileOutputPath) {
    const pathParts = fileOutputPath.split('/');
    const fileName = pathParts.pop();
    if (fileName.indexOf('.epub') === -1) {
      throw new EpubbedError('Invalid file. Output must use an .epub file extension.');
    }
    const outputDirectory = path.resolve(pathParts.join('/'));
    return new Promise((resolve, reject) => {
      fs.readdir(outputDirectory, (error, files) => {
        if(error) {
          reject(new EpubbedError(error.message));
        }

        resolve(files);
      });
    });
  } else {
    throw new EpubbedError('Generating an EPUB file requires a file path');
  }
};

module.exports = {
  validateContent,
  validateFilePath
};