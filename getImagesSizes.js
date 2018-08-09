const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const cardDirectory = './_life';
const files = fs.readdirSync(cardDirectory);

files.forEach(file => {
  const originalFilePath = path.resolve(cardDirectory, file);
  const fileContent = fs.readFileSync(originalFilePath).toString();

  if (fileContent.indexOf('live_video:') !== -1 || fileContent.indexOf('imageWidth') !== -1) { return; }

  const imagePathMatch = (/(img|thumb): \"(.+[^\"])"/g.exec(fileContent) || [])[2];
  if (!imagePathMatch) { return; }

  const { width, height } = sizeOf(path.resolve(__dirname, `.${imagePathMatch}`));

  const splitContent = fileContent.split('\n');

  const newFileContent = [
    ...splitContent.slice(0, splitContent.lastIndexOf('---')),
    `imageWidth: ${width}`,
    `imageHeight: ${height}`,
    ...splitContent.slice(splitContent.lastIndexOf('---')),
  ].join('\n');

  fs.writeFileSync(originalFilePath, newFileContent);
});
