const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 9090);

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

var server = app.listen(app.get('port'), () => {
    console.log('listening on port ', server.address().port);
});
