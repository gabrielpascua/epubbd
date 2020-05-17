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
    .ele('body', { class: 'epubbd-content' })
    .ele('hgroup', { id: 'document-title' })
    .ele('h1', `${content.title}`).up()
    .ele('h2', `${content.subTitle || ''}`).up()
    .up();

  const epubbdDiv = xmlbuilder.create('section');
  const sanitized = sanitizeHtml(content.html.trim());
  epubbdDiv.raw(sanitized);

  html.importDocument(epubbdDiv);
  const htmlString = `<!DOCTYPE html>${html.end({ pretty: true })}`;

  return {
    fileName: `${slugify(content.title)}-${idx}.xhtml`,
    html: htmlString
  };
};

const createOPFXMLString = (options) => {
  const { cover, title, contents } = options;
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
  spine.att('toc', 'ncx');

  if (cover) {
    const fileParts = cover.split('/').pop().toLowerCase().split('.');
    const coverSlug = slugify(fileParts[0]);
    let mime = fileParts[1];
    if(mime === 'jpg') {
      mime = 'jpeg';
    } else if(mime === 'svg') {
      mime = 'svg+xml';
    }

    const coverItem = xmlbuilder.begin()
      .ele('item', {
        id: coverSlug,
        href: fileParts.join('.'),
        properties: 'cover-image',
        'media-type': `image/${mime}`
      });
    manifest.importDocument(coverItem);
  }

  const tocItemXHtml = xmlbuilder.begin()
    .ele('item', {
      id: 'toc',
      href: 'toc.xhtml',
      properties: 'nav',
      'media-type': 'application/xhtml+xml'
    });
  manifest.importDocument(tocItemXHtml);

  const tocItemNcx = xmlbuilder.begin()
    .ele('item', {
      id: 'ncx',
      href: 'toc.ncx',
      'media-type': 'application/x-dtbncx+xml'
    });
  manifest.importDocument(tocItemNcx);

  const tocItemRef = xmlbuilder.begin()
    .ele('itemref', { idref: 'toc'} );
  spine.importDocument(tocItemRef);

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

const createTocNcxXml = ({title, contents }) => {
  const ncx = xmlbuilder.create('ncx')
    .att('version', '2005-01')
    .att('xmlns', 'http://www.daisy.org/z3986/2005/ncx/')
    .ele('docTitle')
    .ele('text', {}, title).up()
    .up()
    .ele('navMap');

  const tocLink = xmlbuilder.begin()
    .ele('navPoint', { id: 'toc' })
    .ele('content', { src: 'toc.xhtml' }).up()
    .ele('navLabel')
    .ele('text', {}, 'Contents');
  ncx.importDocument(tocLink);

  for(let i=0, max=contents.length; i<max; i++) {
    const item = contents[i];
    const key = `${slugify(item.title)}-${i}`;
    const tocLink = xmlbuilder.begin()
      .ele('navPoint', { id: key })
      .ele('content', { src: `${key}.xhtml` }).up()
      .ele('navLabel')
      .ele('text', {}, item.title);
    ncx.importDocument(tocLink);
  }

  return ncx.end({ pretty: true });
};

const createTocXHtml = ({ title, contents }) => {
  const html = xmlbuilder.begin()
    .ele('html', {
      xmlns: 'http://www.w3.org/1999/xhtml',
      'xmlns:epub': 'http://www.idpf.org/2007/ops',
      'xml:lang': 'en',
      lang: 'en'
    })
    .ele('head')
    .ele('meta', { charset: 'UTF-8' }).up()
    .ele('title', {}, title).up()
    .ele('link', {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'styles/css'
    }).up()
    .up()
    .ele('body', { class: 'epubbd-content' })
    .ele('h1', {}, title).up()
    .ele('nav', {'epub:type': 'toc', id: 'toc'})
    .ele('ol');

  const tocLink = xmlbuilder.begin()
    .ele('li')
    .ele('a', { href: 'toc.xhtml' }, 'Contents');
  html.importDocument(tocLink);

  for(let i=0, max=contents.length; i<max; i++) {
    const item = contents[i];
    const key = `${slugify(item.title)}-${i}`;
    const tocLink = xmlbuilder.begin()
      .ele('li')
      .ele('a', { href: `${key}.xhtml` }, item.title);
    html.importDocument(tocLink);
  }

  return html.end({ pretty: true });
};

module.exports = {
  createOPFXMLString,
  createContentXHTML,
  createContainerXml,
  createTocNcxXml,
  createTocXHtml
};