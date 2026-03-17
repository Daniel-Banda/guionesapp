const fs = require('fs');
const buf = fs.readFileSync('test_emoji.pdf');
console.log(buf.toString('utf8').includes('Hello World'));
console.log(buf.indexOf('🚀'));
