const { validateContent, validateFilePath } = require('./validators');
const { writeToFile, createBuffer } = require('./compress');

function setDefaults(options) {
  options.styleUrl = options.styleUrl || '../node_modules/normalize.css/normalize.css';
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