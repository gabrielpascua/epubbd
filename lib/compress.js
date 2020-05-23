const AdmZip = require('adm-zip');
const EpubbdError = require('./epubbed-error');
const path = require('path');
const xmlgen = require('./xml-generator');
const { getBuffer } = require('./file-bufffers');
const { getMime } = require('./mime-type');

const CONTENT_FOLDER = 'Content';

const zipIt = async (epubContents) => {
  try {
    const zip = new AdmZip();

    zip.addFile('mimetype', Buffer.from('application/epub+zip'));

    const containerxml = xmlgen.createContainerXml();
    zip.addFile('META-INF/container.xml', Buffer.from(containerxml));

    const opfXml = xmlgen.createOPFXMLString(epubContents);
    zip.addFile(`${CONTENT_FOLDER}/main.opf`, Buffer.from(opfXml));

    const fontRegular = await getBuffer(`${__dirname}/assets/Lora-Regular.ttf`);
    zip.addFile(`${CONTENT_FOLDER}/assets/Lora-Regular.ttf`, fontRegular);
    const fontBold = await getBuffer(`${__dirname}/assets/Lora-Bold.ttf`);
    zip.addFile(`${CONTENT_FOLDER}/assets/Lora-Bold.ttf`, fontBold);

    const tocNcx = xmlgen.createTocNcxXml(epubContents);
    zip.addFile(`${CONTENT_FOLDER}/toc.ncx`, Buffer.from(tocNcx));
    const tocXHtml = xmlgen.createTocXHtml(epubContents);
    zip.addFile(`${CONTENT_FOLDER}/toc.xhtml`, Buffer.from(tocXHtml));

    if(epubContents.cover) {
      const coverIsFile = !!getMime(epubContents.cover);
      let coverBuffer;
      let filename;
      if (coverIsFile) {
        filename = epubContents.cover.split('/').pop().toLowerCase();
        coverBuffer = await getBuffer(epubContents.cover);
      } else {
        const dataUrl = epubContents.cover.split(':').pop().split(';');
        const mimeType = dataUrl[0];
        const base64 = dataUrl[1];
        filename = `cover.${mimeType.split('/')}`;
        coverBuffer = Buffer.from(base64.substring('base64,'.length).trim(), 'base64');
      }
      zip.addFile(`${CONTENT_FOLDER}/${filename}`, coverBuffer);
      const coverXHtml = xmlgen.createCoverXHtml(`${CONTENT_FOLDER}/${filename}`);
      zip.addFile(`${CONTENT_FOLDER}/cover.xhtml`, Buffer.from(coverXHtml));
    }

    const cssIsFile = !!getMime(epubContents.css);
    const styleBuffer = cssIsFile ? (await getBuffer(epubContents.css)) : Buffer.from(epubContents.css);
    zip.addFile(`${CONTENT_FOLDER}/styles.css`, styleBuffer);
    for(let i=0, max=epubContents.contents.length; i<max; i++) {
      const xhtml = xmlgen.createContentXHTML(epubContents.contents[i], i, max);
      zip.addFile(`${CONTENT_FOLDER}/${xhtml.fileName}`, Buffer.from(xhtml.html));
    }

    return zip;
  } catch (error) {
    throw new EpubbdError(error.message);
  }
};

const writeToFile = async (epubContents, outputPath) => {
  const zip = await zipIt(epubContents);
  const localPath = path.resolve(outputPath);
  zip.writeZip(localPath);
};

const createBuffer = async (epubContents) => {
  const zip = await zipIt(epubContents);
  return zip.toBuffer();
};

module.exports = {
  writeToFile,
  createBuffer
};