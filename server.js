var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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

// connection configurations
var dbConn = mysql.createConnection({
    host: 'jdbc:mysql://mysql.gamification.svc.cluster.local:3306/mysql',
    user: 'xxuser',
    password: 'welcome1',
    database: 'sampledb'
});
// connect to database
dbConn.connect(); 

// Retrieve user with id 
app.get('/products/:id', function (req, res) {
    let item_number = req.params.id;
    if (!item_number) {
        return res.status(400).send({ error: true, message: 'Please provide product sku number' });
    }
    dbConn.query('SELECT * FROM XXIBM_PRODUCT_SKU where Item Number=?', item_number, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'users list.' });
    });
});

// set port
app.listen(port, ip);
//app.listen(3000, function () {
//    console.log('Node app is running on port 3000');
//});
module.exports = app;