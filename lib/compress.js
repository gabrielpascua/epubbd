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
    zip.addFile('META-INF/', Buffer.from(''));
    zip.addFile(`${CONTENT_FOLDER}/`, Buffer.from(''));

    const containerxml = xmlgen.createContainerXml();
    zip.addFile('META-INF/container.xml', Buffer.from(containerxml));

    const opfXml = xmlgen.createOPFXMLString(epubContents);
    zip.addFile(`${CONTENT_FOLDER}/main.opf`, Buffer.from(opfXml));

    const tocNcx = xmlgen.createTocNcxXml(epubContents);
    zip.addFile(`${CONTENT_FOLDER}/toc.ncx`, Buffer.from(tocNcx));
    const tocXHtml = xmlgen.createTocXHtml(epubContents);
    zip.addFile(`${CONTENT_FOLDER}/toc.xhtml`, Buffer.from(tocXHtml));

    if(epubContents.cover) {
      const coverBuffer = await getBuffer(epubContents.cover);
      const filename = epubContents.cover.split('/').pop().toLowerCase();
      zip.addFile(`${CONTENT_FOLDER}/${filename}`, coverBuffer);
    }

    const styleBuffer = await getBuffer(epubContents.styleUrl);
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