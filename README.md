# epubbd
Promise-based Node.js EPUB 3.0 generator


```js
const epubbd = require('epubbd');
const options = {
    title: 'My Book',
    css: './style.css',
    cover: 'https://i.picsum.photos/id/127/200/300.jpg',
    contents: [
        title: 'Chapter 1',
        subTitle: 'The very first chapter',
        html: '<div><p>HTML that goes inside the BODY tag</p></div>'
    ]
}

(async() => {
  // create a buffer OR
  await epubbd.toBufferAsync(options);

  // output to a file
  await epubbd.toFileAsync(options, 'my-book.epub');
})();
```
  


## Epubbd Options
| Property | Example | Description |
|-------------------|--------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| title | `'My Book of Nuts'` | The title of your .epub |
| author | `'Jane Smith'` | The author of your .epub |
| publisher | `'Squirrel Papers'` | The publisher of your .epub |
| css | `'./main.css'` or<br /> `'https://a.com/main.css'` or<br />`'body.epubbd-content{color:aqua}'` |  A url, local path of your .css file, or a string of your CSS styles.<br />The BODY tag has `epubbd-content` css class you can target. |
| cover | `'./my-book-image.jpg'` or<br />`'https://a.com/cover.jpg'` or <br /> `'data:image/png;base64,..'` | A url, local path, or a [Data URL string](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) of the cover image |
| contents | `[{ title, html }]` | An array of your book's content pages |
| contents[0].title | `'Chapter 1'` | Page content title |
| contents[0].subTitle | `'The Very First'` | Page content sub-title |
| contents[0].html | `'Hello World'` | Page content HTML |

  


## Epubbd Methods

### toFileAsync(options, outputLocation)
* Creates an .epub file to the specified output location
* Returns an empty Promise, else an EpubbdError

### toBufferAsync(options)
* Creates a buffer representation of the .epub file
* Returns a Node Buffer, else an EpubbdError