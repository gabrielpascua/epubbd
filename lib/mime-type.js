/*https://idpf.github.io/epub-cmt/v3/*/

module.exports = {
  getMime: (fileOrUrlPath) => {
    const fileExtension = fileOrUrlPath.split('.');
    if (fileExtension.length) {
      switch(fileExtension.pop().toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'png':
        return 'image/png';
      case 'svg':
        return 'image/svg+xml';
      case 'ttf':
        return 'application/font-sfnt';
      case 'woff':
        return 'application/font-woff';
      case 'css':
        return 'text/css';
      }
    }

    return;
  }
};