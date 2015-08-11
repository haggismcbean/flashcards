var express = require('express'),
    api = require('./routes/api');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/api', api.findAll);
app.get('/api/:id', api.findById);
app.post('/api', api.addSet);
app.put('/api/:id', api.updateSet);
app.delete('/api/:id', api.deleteSet);

app.listen(3000);
console.log('Listening on port 3000...');