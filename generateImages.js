var fs = require('fs');
var readline = require('readline');

var fileLineReaeder = readline.createInterface({
    input: fs.createReadStream('./list.cvs')
});

const generateFile = (link, date, embed) => `---
date: ${date} 15:20:09 +0200
embed: "${embed}"
link: "${link}"
img: ""
---
`;

var fileCounter = 220;
fileLineReaeder.on('line', line => {
    var parts = line.split(',').slice(1);

    if (parts[0].length) {
        var linkURL = parts[0];
        var date = parts[1].split('/').reverse().join('-');
        var embed = "";
        if (linkURL.toLowerCase().indexOf('instagram') + 1) {
            embed = 'instagram';
        } else if (linkURL.toLowerCase().indexOf('facebook') + 1) {
            embed = 'facebook';
        } else if (linkURL.toLowerCase().indexOf('youtube') + 1) {
            embed = 'youtube';
        } else if (linkURL.toLowerCase().indexOf('coub') + 1) {
            embed = 'coub';
        }

        fs.writeFile(`./test/00${fileCounter++}_item.md`, generateFile(linkURL, date, embed), err => {
            if (err) {
                console.log(err);
            }
            console.log('File written ', fileCounter);
        })
    }
});