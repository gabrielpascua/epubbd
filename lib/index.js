const { validateContent, validateFilePath, validateMimeType } = require('./validators');
const { writeToFile, createBuffer } = require('./compress');

function setDefaults(options) {
  options.styleUrlOrPath = options.styleUrlOrPath || `${__dirname}/assets/style.css`;
  return options;
}

function validateOptions(options) {
  validateContent(options);

  if (options.coverUrlOrPath) {
    const coverParts = options.coverUrlOrPath.split('/');
    if (coverParts.length) {
      const file = coverParts.pop();
      if (file.split('.').length === 2) {
        validateMimeType(options.coverUrlOrPath, ['jpg', 'jpeg', 'png', 'gif', 'svg']);
      }
    }
  }

  if (options.styleUrlOrPath) {
    const cssParts = options.styleUrlOrPath.split('/');
    if (cssParts.length) {
      const file = cssParts.pop();
      if (file.split('.').length === 2) {
        validateMimeType(options.styleUrlOrPath, ['css']);
      }
    }
  }
}

const toFileAsync = async (options, fileOutputPath) => {
  validateOptions(options);
  await validateFilePath(fileOutputPath);
  options = setDefaults(options);
  await writeToFile(options, fileOutputPath);
};

const toBufferAsync = async (options) => {
  validateOptions(options);
  options = setDefaults(options);
  return await createBuffer(options);
};

module.exports = {
  toFileAsync,
  toBufferAsync
};
