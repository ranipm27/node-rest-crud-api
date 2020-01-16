var express = require('express');
require('dotenv').config({ silent: true });
var bodyParser = require('body-parser');

var app = express();

//var port = 4000;
//var port = process.env.PORT;

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
	
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// default route
app.get('/', function (req, res) {

    return res.send({ error: true, message: 'Welcome Page for Product Service' })
});

//import routes
require("./app/routes/product.routes.js")(app);

app.listen(port);
module.exports = app;
