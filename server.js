var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var express = require('express');
var app = express();
  var heapdump = require('heapdump');

var upload_dir = path.join(__dirname, 'uploads');

app.get('/', function(req, res){
  res.send('Upload server');
});

app.post('/upload', function(req, res, next){
  var form = new multiparty.Form();

  form.on('part', function(part) {
    var name, stream;

    if (part.filename == null) {
      part.resume();
    } else {
      name = part.filename;
      console.log(name);
      stream = fs.createWriteStream(path.join(upload_dir, name));

      part.on('end', function(err) {
        if (err) {
          console.log(err);
          return res.send(500, {
            success: false
          });
        } else {
          clearInterval(interval);
          console.log("File " + name + " saved to disk.");
        }
      });
      part.pipe(stream);

      interval = setInterval(function() {
        console.log(process.memoryUsage());
      }, 500);
    }
  });

  form.on('progress', function(bytesReceived, bytesExpected) {});

  form.on('error', function(err) {
    console.log(err);
    next(err);
  });

  form.on('close', function() {
    return res.send(201, {
      success: true
    });
  });

  form.parse(req);
});

app.listen(3000, function() {
  console.log('Upload server is listening on 3000 port...');
});
