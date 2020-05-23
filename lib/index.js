const { validateContent, validateFilePath, validateMimeType } = require('./validators');
const { writeToFile, createBuffer } = require('./compress');

function setDefaults(options) {
  options.css = options.css || `${__dirname}/assets/style.css`;
  return options;
}

function validateOptions(options) {
  validateContent(options);

  if (options.cover) {
    const coverParts = options.cover.split('/');
    if (coverParts.length) {
      const file = coverParts.pop();
      if (file.split('.').length === 2) {
        validateMimeType(options.cover, ['jpg', 'jpeg', 'png', 'gif', 'svg']);
      }
    }
  }

  if (options.css) {
    const cssParts = options.css.split('/');
    if (cssParts.length) {
      const file = cssParts.pop();
      if (file.split('.').length === 2) {
        validateMimeType(options.css, ['css']);
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
