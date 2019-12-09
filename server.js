var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});


//mysql configuration
var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'mysql.database-check.svc.cluster.local';
var mysqlPort = process.env.OPENSHIFT_MYSQL_DB_PORT || 3306;
var mysqlUser = 'ccuser'; //mysql username
var mysqlPass = 'welcome1'; //mysql password
var mysqlDb = 'productdb'; //mysql database name

//connection strings
var mysqlString = 'mysql://' + mysqlUser + ':' + mysqlPass + '@' + mysqlHost + ':' + mysqlPort + '/' + mysqlDb;


//connect to mysql
var mysqlClient = mysql.createConnection(mysqlString);
mysqlClient.connect(function (err) {
    if (err) console.log(err);
});

//MySQL is running!
app.get('/mysql', function (req, res) {
    mysqlClient.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
        if (err) {
            res.send('NOT OK' + JSON.stringify(err));
        } else {
            res.send('OK: ' + rows[0].solution);
        }
    });
});

// connection configurations
//var dbConn = mysql.createConnection({
//    host: 'jdbc:mysql://mysql.gamification.svc.cluster.local:3306/mysql',
//    user: 'xxuser',
//    password: 'welcome1',
//    database: 'sampledb'
//});
// connect to database
//dbConn.connect(); 

// Retrieve product with id 
app.get('/products/:id', function (req, res) {
    let item_number = req.params.id;
    if (!item_number) {
        return res.status(400).send({ error: true, message: 'Please provide product sku number' });
    }
    let item_number_int = parseInt(req.params.id);
    mysqlClient.query('SELECT * FROM XXIBM_PRODUCT_SKU WHERE "Item Number" = ? ', item_number_int, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'product list.' });
    });
});

// set port
app.listen(port, ip);
//app.listen(3000, function () {
//    console.log('Node app is running on port 3000');
//});
module.exports = app;
