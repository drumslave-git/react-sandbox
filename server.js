const path = require('path');
const express = require('express');
const request = require('request');
const http = require("http");
const https = require("https");
const htmlparser = require("htmlparser2");

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
// app.use(express.static(path.join(__dirname, 'build')));
app.set('port', process.env.PORT || 7070);

app.use('/api', (req, res) => {
    req.pipe(request(`https://redmine.enaikoon.de${req.url}`)).pipe(res);
});

app.use('/testapi', (req, res) => {
    req.pipe(request(`https://test-redmine.enaikoon.de${req.url}`)).pipe(res);
});

app.use('/redmine', (req, res) => {
    req.pipe(request(`https://test-redmine.enaikoon.de${req.url}`)).pipe(res);
});

app.use('/rms/api', (req, res) => {
    req.pipe(request(`https://drumslave-rms-api.herokuapp.com/api/v1${req.url}`)).pipe(res);
});

app.use("/fetch", function(req, res, next) {
    if(req.query) {
        if(req.query.url === undefined) {
            res.send({message: "url cannot be undefined"});
        }
        var urlPrefix = req.query.url.match(/.*?:\/\//g);
        req.query.url = req.query.url.replace(/.*?:\/\//g, "");
        // var options = {
        //     host: req.query.url
        // };
        var options = {
            host: 'test-redmine.enaikoon.de',
            path: '/custom_fields/6/enumerations'
        };

        if(urlPrefix !== undefined && urlPrefix !== null && urlPrefix[0] === "https://") {
            // options.port = 443;
            https.get(options, function(result) {
                processResponse(result);
            }).on('error', function(e) {
                res.send({message: e.message});
            });
        } else {
            // options.port = 80;
            http.get(options, function(result) {
                processResponse(result);
            }).on('error', function(e) {
                res.send({message: e.message});
            });
        }

        var processResponse = function(result) {
            var data = "";
            result.on("data", function(chunk) {
                data += chunk;
            });
            var tags = [];
            var tagsCount = {};
            var tagsWithCount = [];
            result.on("end", function(chunk) {
                var parser = new htmlparser.Parser({
                    onopentag: function(name, attribs) {
                        if(tags.indexOf(name) === -1) {
                            tags.push(name);
                            tagsCount[name] = 1;
                        } else {
                            tagsCount[name]++;
                        }
                    },
                    onend: function() {
                        for(var i = 0; i < tags.length; i++) {
                            tagsWithCount.push({name: tags[i], count: tagsCount[tags[i]]});
                        }
                    }
                }, {decodeEntities: true});
                parser.write(data);
                parser.end();
                res.send({website: req.query.url, data: data, tags: tagsWithCount});
            });
        }

    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(app.get('port'), () => {
    console.log('listening on port ', server.address().port);
});
