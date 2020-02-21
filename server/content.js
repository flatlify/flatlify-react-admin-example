const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');

const fileExistError = new Error({ code: 409, message: 'This name is already taken' });

const save = (contentType, contentName, data, cb) => {
  const parsedData = JSON.parse(String(data));
  const filePath = path.resolve('_content', contentType, contentName + '.json');
  const newFilePath = path.resolve('_content', contentType, parsedData.slug + '.json');

  if (contentName === parsedData.slug) {
    fse.outputFile(newFilePath, data, cb);
  } else {
    fs.stat(newFilePath, function(err, stat) {
      if (err === null) {
        throw fileExistError;
      } else if (err.code === 'ENOENT') {
        fs.rename(filePath, newFilePath, err => {
          if (err) throw err;
          fse.outputFile(newFilePath, data, cb);
        });
      } else {
        throw err;
      }
    });
  }
};

const create = (contentType, data, cb) => {
  const parsedData = JSON.parse(String(data));
  const filePath = path.resolve('_content', contentType, parsedData.slug + '.json');
  fs.stat(filePath, function(err, stat) {
    if (err === null) {
      throw fileExistError;
    } else if (err.code === 'ENOENT') {
      fs.appendFile(filePath, data, function(err) {
        if (err) throw err;
      });
    } else {
      throw err;
    }
  });
};

const deleteContent = (contentType, contentName, cb) => {
  const filePath = path.resolve('_content', contentType, contentName + '.json');
  fs.unlink(filePath, err => {
    if (err) throw err;
  });
};

const load = (contentType, slug, cb) => {
  const filePath = path.resolve('_content', contentType, slug + '.json');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }

      try {
      } catch (e) {}
      cb(JSON.parse(String(data)));
    });
  });
};

const list = (type, cb) => {
  const contentDir = path.resolve('_content', type);
  readFiles(contentDir, cb);
};

const listTypes = cb => {
  const contentDir = path.resolve('configs', 'content-types');
  readFiles(contentDir, types => {
    cb(types.map(entry => entry.type));
  });
};

module.exports = {
  list,
  listTypes,
  save,
  load,
  create,
  deleteContent,
};
