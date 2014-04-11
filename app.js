var connect = require('connect');

var app = connect();

app.use(connect.logger());
app.use(connect.query());

app.use('/isbn/', require('./index').isbnPNG);

app.listen(process.env.npm_package_config_port || 8046);
console.log('Server running...');
