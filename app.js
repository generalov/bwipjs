var connect = require('connect');
var port = process.env.npm_package_config_port || 8046;

var app = connect();

app.use(connect.logger());
app.use(connect.query());

app.use('/isbn/', require('./index').isbnPNG);

app.listen(port);
console.log('Server running at ' + port + ' port...');
