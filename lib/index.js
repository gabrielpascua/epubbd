const { validateContent, validateFilePath } = require('./validators');
const { writeToFile, createBuffer } = require('./compress');
const path = require('path');

function setDefaults(options) {
  options.styleUrl = options.styleUrl || path.resolve(process.cwd(), 'lib/assets/style.css');
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
