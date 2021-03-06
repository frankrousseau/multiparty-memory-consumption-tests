var fs = require('fs');
var path = require('path');
var request = require('request');

// Test file paths
var file_small = './small.pdf';
var file_medium = './medium.mp4';
var file_big = './big.mkv';

// File used for upload
var selected_file = file_medium;


// File upload via request library
req = request.post('http://localhost:3000/upload', function(req, res, body) {
    console.log(body);
});
var form = req.form();
form.append(
  'my_file',
  fs.createReadStream(path.join(__dirname, selected_file))
);

// Display memory consumption
setInterval(function() {
  console.log(process.memoryUsage());
}, 500);
