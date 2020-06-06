const { getMime } = require('./mime-type');
const { getBuffer } = require('./file-bufffers');

const convertImagesToDataUrls = async (htmlContent) => {
  const imageRegex = /<img\s+[^>]*src="([^"]*)"[^>]*>/gi;
  let replacements = [];
  let matches;
  while ((matches = imageRegex.exec(htmlContent)) !== null) {
    let [, imgSource] = matches;
    let mimeType = getMime(imgSource);
    let imageAllowed = !!(mimeType && mimeType.includes('image'));
    if (imageAllowed) {
      try {
        const imageBuffer = await getBuffer(imgSource);
        replacements.push([
          imgSource, `data:${mimeType};base64,${imageBuffer.toString('base64')}`
        ]);        
      } catch (error) {
        console.warn(error);
      }
    }
  }

  return replacements;
};

module.exports = {
  convertImagesToDataUrls
};
