/* https://github.com/cthackers/adm-zip/wiki/ADM-ZIP#a17 */
const AdmZip = require('adm-zip');
const EpubbedError = require('./epubbed-error');
const path = require('path');
const parser = require('./xml-parser');
const { getBuffer } = require('./file-bufffers');

const zipIt = async (epubContents) => {
  try {
    const zip = new AdmZip();

    zip.addLocalFile(path.resolve(__dirname, './assets/mimetype'));
    zip.addFile('META-INF/', Buffer.from(''));
    zip.addLocalFile(path.resolve(__dirname, './assets/templates/container.xml'), 'META-INF');

    const opfFileName = 'main.opf';
    const opfXml = await parser.createOPFXMLString(epubContents.title, epubContents.contents);
    zip.addFile('Content/', Buffer.from(''));
    zip.addFile(`Content/${opfFileName}`, Buffer.alloc(opfXml.length, opfXml));

    const styleFileName = 'styles.css';
    const styleBuffer = await getBuffer(epubContents.styleUrl);
    zip.addFile(`Content/${styleFileName}`, styleBuffer);
    for(let i=0, max=epubContents.contents.length; i<max; i++) {
      const xhtml = await parser.createContentXHTML(epubContents.contents[i], i);
      zip.addFile(`Content/${xhtml.fileName}`, Buffer.alloc(xhtml.html.length, xhtml.html));
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