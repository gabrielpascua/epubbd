# epubbd
Promise-based Node.js EPUB 3.0 generator


```js
const epubbd = require('epubbd');
const options = {
    title: 'My Book',
    css: './style.css',
    cover: 'https://i.picsum.photos/id/127/200/300.jpg',
    contents: [{
        title: 'Chapter 1',
        subTitle: 'The very first chapter',
        html: '<div><p>HTML that goes inside the BODY tag</p></div>'
    }]
}

(async() => {
  // create a buffer OR
  await epubbd.toBufferAsync(options);

  // output to a file
  await epubbd.toFileAsync(options, 'my-book.epub');
})();
```

<br />
<br />

## Epubbd Methods

### toFileAsync(options, outputLocation)
* Creates an .epub file to the specified output location
* Returns an empty Promise, else an EpubbdError

### toBufferAsync(options)
* Creates a buffer representation of the .epub file
* Returns a Node Buffer, else an EpubbdError

<br />
<br />

## Epubbd Options

### title
The title of your EPUB file  
Example: `'My Book of Nuts'`  


### author
The author of your EPUB file. Setting multiple authors is not supported right now.  
Example: `'Jane Smith'`

### publisher
The publisher of your EPUB file  
Example: `'Squirrel Papers'`

### css
The stylesheet definition of your EPUB file.  The `<body/>` tag of
all XHTML pages are assigned a CSS class of `epubbd-content` you can
use to target your HTML elements.  If empty, this will default to a pre-defined CSS file that uses Lora Regular and Bold fonts.  
Examples:  
* `'./main.css'`
* `'https://www.abc.com/css/styles.min.css'`
* `'body.epubbd-content{color:aqua}'`

### cover
The image file or [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) of your cover page. JPEG, PNG, GIF and SVG are the supported file types.  
Examples:  
* `'./my-book-image.jpg'`
* `'https://www.abc.com/img/cover.jpg'` 
* `'data:image/png;base64,..'`

### contents
An array of your book's content pages.  
Example: `[{ title, subTitle, html }]`

#### contents[0].title
Page content title.  This is the `<h1>` inside an `<hgroup>` tag at the beginning of your content page.  It is also the same entry added to your book's Table of Contents.  
Example: `'Chapter 1'`

#### contents[0].subTitle
Page content sub title.  This is the `<h2>` after the `<h1>` tag of the title at the beginning of your content page.  
Example: `'The Very First Chapter'`


#### contents[0].html
The HTML of your content page.  The markup is sanitized before adding to the page to ensure XHTML compatibility.  Embedded images with local paths must set the "src" attribute relative to where the currently running script is.
Example: `'Hello World <br> Line break tag will be converted to <br/>'`
