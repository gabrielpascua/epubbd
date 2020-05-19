# epubbd
Promise-based Node.js EPUB 3.0 generator


```
const epubbd = require('epubbd');
const options = {
    title: 'My Book',
    styleUrlOrPathOrPath: './style.css',
    coverUrlOrPath: 'https://i.picsum.photos/id/127/200/300.jpg',
    contents: [
        title: 'Chapter 1',
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
|-------------------|----------------------------------|--------------------------------------------------|
| title | 'My Book' | The title of your .epub |
| author | 'Jane Smith' | The author of your .epub |
| publisher | 'Squirrel Papers' | The publisher of your .epub |
| styleUrlOrPath | './main.css' | A url or the local path of your .css file |
| coverUrlOrPath | './my-book-image.jpg' | A url or the local path of your image cover file |
| contents | [{ title, html }] | An array of your book's content |
| contents[0].title | 'Chapter 1' | Book content title |
| contents[0].html | '<article>Hello World</article>' | Book content HTML |

## Epubbd Methods

### toFileAsync(options, outputLocation)
* Creates an .epub file to the specified output location
* Returns an empty Promise

### toBufferAsync(options)
* Creates a buffer representation of the .epub file
* Returns a Node Buffer