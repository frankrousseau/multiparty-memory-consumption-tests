var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var express = require('express');

// Set express app.
var app = express();

// Define upload dir path.
var upload_dir = path.join(__dirname, 'uploads');

// Index route.
app.get('/', function(req, res){
  res.send('Upload server');
});

// Upload route.
app.post('/upload', function(req, res, next){
  var form = new multiparty.Form();

  // Listen for incoming parts of the form.
  form.on('part', function(part) {
    var name, stream;

    // It's a field, not a file.
    if (part.filename == null) {
      part.resume();

    // It's a file.
    } else {
      name = part.filename;

      // Write file in upload dir.
      stream = fs.createWriteStream(path.join(upload_dir, name));

      // Display something when file finished to upload.
      part.on('end', function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("File " + name + " saved to disk.");
        }
      });

      // Pipe the part parsing stream to the file writing stream.
      part.pipe(stream);

    }
  });

  // End the request when something goes wrong.
  form.on('error', function(err) {
    console.log(err);
    next(err);
  });

  // Send success code if file was successfully uploaded.
  form.on('close', function() {
    return res.send(201, {
      success: true
    });
  });

  form.parse(req);
});

// Display memory usage.
interval = setInterval(function() {
  console.log(process.memoryUsage());
}, 500);

// Run server.
app.listen(3000, function() {
  console.log('Upload server is listening on 3000 port...');
});
