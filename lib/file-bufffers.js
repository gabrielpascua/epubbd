const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const EpubbedError = require('./epubbed-error');

const getRemoteFile = async (remotePath) => {
  const remoteProtocol = remotePath.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    remoteProtocol.get(remotePath, (res) => {
      res.on('data', (data) => {
        resolve(data);
      });

    }).on('error', (error) => {
      reject(error);
    });
  });
};

const getLocalFile = async (localPath) => {
  return new Promise((resolve, reject) => {
    const location = path.resolve(process.cwd(), localPath);
    fs.readFile(location, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
};

const getBuffer = async (filePath) => {
  if (!filePath) {
    throw new EpubbedError('Cannot read an empty file location');
  }

  try {
    if (filePath.startsWith('http')) {
      return await getRemoteFile(filePath);
    } else {
      return await getLocalFile(filePath);
    }        
  } catch (error) {
    throw new EpubbedError(error.message);
  }
};

module.exports = {
  getBuffer
};