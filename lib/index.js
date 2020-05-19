const { validateContent, validateFilePath } = require('./validators');
const { writeToFile, createBuffer } = require('./compress');

function setDefaults(options) {
  options.styleUrlOrPath = options.styleUrlOrPath || `${__dirname}/assets/style.css`;
  return options;
}  

const toFileAsync = async (options, fileOutputPath) => {
  validateContent(options);
  await validateFilePath(fileOutputPath);
  options = setDefaults(options);
  await writeToFile(options, fileOutputPath);
};

const toBufferAsync = async (options) => {
  validateContent(options);
  options = setDefaults(options);
  return await createBuffer(options);
};

module.exports = {
  toFileAsync,
  toBufferAsync
};
