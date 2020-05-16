const xmlbuilder = require('xmlbuilder');
const sanitizeHtml = require('sanitize-html');

const slugify = (string) => {
  return string.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

const createContainerXml = () => {
  const container = xmlbuilder.create('container')
    .att('version', '1.0')
    .att('xmlns', 'urn:oasis:names:tc:opendocument:xmlns:container')
    .ele('rootfiles')
    .ele('rootfile', {
      'full-path': 'Content/main.opf',
      'media-type': 'application/oebps-package+xml'
    });

  return container.end({ pretty: true });
};

const createContentXHTML = (content, idx) => {
  const html = xmlbuilder.begin()
    .ele('html', {
      xmlns: 'http://www.w3.org/1999/xhtml',
      'xmlns:epub': 'http://www.idpf.org/2007/ops',
      'xml:lang': 'en',
      lang: 'en'
    })
    .ele('head')
    .ele('meta', { charset: 'UTF-8' }).up()
    .ele('title', {}, content.title).up()
    .ele('link', {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'styles/css'
    }).up()
    .up()
    .ele('body');

  const epubbdDiv = xmlbuilder.create('div');
  epubbdDiv.att('class', 'epubbd-content');
  const sanitized = sanitizeHtml(content.html.trim());
  epubbdDiv.raw(sanitized);

  html.importDocument(epubbdDiv);
  const htmlString = `<!DOCTYPE html>${html.end({ pretty: true })}`;

  return {
    fileName: `${slugify(content.title)}-${idx}.xhtml`,
    html: htmlString
  };
};

const createOPFXMLString = (title, contents) => {
  const opf = xmlbuilder.create('package')
    .att('xmlns', 'http://www.idpf.org/2007/opf')
    .att('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
    .att('xmlns:dcterms', 'http://purl.org/dc/terms/')
    .att('version', '3.0')
    .att('xml:lang', 'en')
    .ele('metadata')
    .ele('dc:language', {}, 'en-us').up()
    .ele('dc:identifier', {}, Date.now()).up()
    .ele('dc:title', {}, title).up()
    .ele('dcterms:modified', {}, (new Date()).toISOString())
    .up();
  
  const manifest = xmlbuilder.create('manifest');
  const spine = xmlbuilder.create('spine');
  for(let i=0, max=contents.length; i<max; i++) {
    const item = contents[i];
    const key = `${slugify(item.title)}-${i}`;
    const manifestItem = xmlbuilder.begin()
      .ele('item', {
        id: key,
        href: `${key}.xhtml`,
        'media-type': 'application/xhtml+xml'
      });
    manifest.importDocument(manifestItem);

    const spineItem = xmlbuilder.begin()
      .ele('itemref', {
        idref: key
      });
    spine.importDocument(spineItem);
  }

  opf
    .up()
    .importDocument(manifest)
    .importDocument(spine);
  
  const xml = opf.end({ pretty: true });
  return xml;
};

module.exports = {
  createOPFXMLString,
  createContentXHTML,
  createContainerXml
};