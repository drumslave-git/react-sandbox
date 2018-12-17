const path = require('path');
const express = require('express');
const request = require('request');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 9090);

app.use('/api', (req, res) => {
    req.pipe(request(`https://redmine.enaikoon.de${req.url}`)).pipe(res);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(app.get('port'), () => {
    console.log('listening on port ', server.address().port);
});
