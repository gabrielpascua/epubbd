/*https://idpf.github.io/epub-cmt/v3/*/

module.exports = {
  getMime: (fileOrUrlPath) => {
    const fileExtension = fileOrUrlPath.split('/').pop().split('.').pop().toLowerCase();
    switch(fileExtension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'png':
      return 'image/png';
    case 'svg':
      return 'image/svg+xml';
    default:
      return '';
    }
  }
};