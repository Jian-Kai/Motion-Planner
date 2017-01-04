var express                         = require('express'),				// npm install express
 	  app                             = express(),
    readHamdler = require('./javascript/read.js');


app.get('/index', readHamdler.callback);
app.get('/index2', readHamdler.callback);


var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Express server listening on port %d", port);
});

app.use(express.static(__dirname + '/html/'));
