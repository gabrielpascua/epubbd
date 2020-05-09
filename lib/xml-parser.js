const { getBuffer } = require('./file-bufffers');
const xml2js = require('xml2js');
 
const parser = new xml2js.Parser();

const slugify = (string) => {
  return string.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

const createOPFXMLString = async (title, contents) => {
  const opfBuffer = await getBuffer('./assets/templates/opf.xml');
  const opf = await parser.parseStringPromise(opfBuffer);

  opf.package.metadata[0]['dc:identifier'] = { _ : Date.now() };
  opf.package.metadata[0]['dc:title'] = { _ : title };
  opf.package.metadata[0].meta = {
    $: {
      property: 'dcterms:modified'
    },
    _: (new Date()).toISOString()
  };

  opf.package.manifest = [];
  opf.package.spine = [];
  for(let i=0, max=contents.length; i<max; i++) {
    const item = contents[i];
    const key = `${slugify(item.title)}-${i}`;

    const manifest = {
      item: {
        $: {
          id: key,
          href: `${key}.xhtml`,
          'media-type': 'application/xhtml+xml'
        }
      }
    };
    opf.package.manifest.push(manifest);

    const spine = {
      itemref: {
        $: {
          idref: key
        }
      }
    };
    opf.package.spine.push(spine);
  }

  const builder = new xml2js.Builder({ headless: false });
  return builder.buildObject(opf);
};

const createContentXHTML = async (content, idx) => {
  const opfBuffer = await getBuffer('./assets/templates/xhtml.xml');
  const xhtml = await parser.parseStringPromise(opfBuffer);
  xhtml.html.body = await parser.parseStringPromise(`<div class="epubbed-content">${content.html}</div>`);
  const builder = new xml2js.Builder({ headless: true });
  return {
    fileName: `${slugify(content.title)}-${idx}.xhtml`,
    html: `<!DOCTYPE html>${builder.buildObject(xhtml)}`
  };
};

module.exports = {
  createOPFXMLString,
  createContentXHTML
};