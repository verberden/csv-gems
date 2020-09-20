const fs = require('fs');
const signale = require('signale');

function unlinkFile(path) {
  fs.unlink(path, (err) => {
    if (err) signale.error(err.message);
  });
}

function unlinkFiles(files) {
  const tmpFilesPath = [];
  const keys = Object.keys(files);
  keys.forEach((key) => {
    const value = files[key];
    if (Array.isArray(value)) {
      value.forEach((el) => {
        tmpFilesPath.push(el.tempFilePath);
      });
    } else {
      tmpFilesPath.push(value.tempFilePath);
    }
  });
  tmpFilesPath.forEach((tmpPath) => {
    unlinkFile(tmpPath);
  });
}

module.exports = {
  unlinkFile,
  unlinkFiles,
};
