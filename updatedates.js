var fs = require('fs');
var readline = require('readline');

var fileCounter = 227;
var last = 330;

for (let i = fileCounter; i <= last; i++) {
    let fileName = `./_life/00${i}_item.md`;
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.error(err);
        }
        var fileContent = data.toString();
        var dateString = fileContent.split('\n')[1].split(' ')[1];
        var parts = dateString.split('-');
        let [year, day, month] = parts;
        dateString = [year, month, day].join('-');


        var fileArr = fileContent.split('\n');
        fileArr[1] = `date: ${dateString} 15:20:09 +0200`;

        fs.writeFile(fileName, fileArr.join('\n'), (err) => {
            if (err) {
                console.error(err)
            }
        });
    });
};
