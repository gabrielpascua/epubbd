const AdmZip = require('adm-zip');
const EpubbedError = require('./epubbed-error');
const path = require('path');
const xmlgen = require('./xml-generator');
const { getBuffer } = require('./file-bufffers');

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

    if(epubContents.coverUrlOrPath) {
      const coverBuffer = await getBuffer(epubContents.coverUrlOrPath);
      const filename = epubContents.coverUrlOrPath.split('/').pop().toLowerCase();
      zip.addFile(`${CONTENT_FOLDER}/${filename}`, coverBuffer);
      const coverXHtml = xmlgen.createCoverXHtml(`${CONTENT_FOLDER}/${filename}`);
      zip.addFile(`${CONTENT_FOLDER}/cover.xhtml`, Buffer.from(coverXHtml));
    }

    const styleBuffer = await getBuffer(epubContents.styleUrlOrPath);
    zip.addFile(`${CONTENT_FOLDER}/styles.css`, styleBuffer);
    for(let i=0, max=epubContents.contents.length; i<max; i++) {
      const xhtml = xmlgen.createContentXHTML(epubContents.contents[i], i);
      zip.addFile(`${CONTENT_FOLDER}/${xhtml.fileName}`, Buffer.from(xhtml.html));
    }

    return zip;
  } catch (error) {
    throw new EpubbedError(error.message);
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