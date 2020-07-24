'use strict';
const http = require('http');
const pug = require('pug');
const server = http
    .createServer((req, res) => {
        const now = new Date();
        console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        // res.write(req.headers['user-agent']);

        switch (req.method) {
            case 'GET':
                // res.write('GET ' + req.url);
                // const fs = require('fs');
                // const rs = fs.createReadStream('./form.html');
                // rs.pipe(res);
                if (req.url === '/enquetes/yaki-shabu') {
                    res.write(pug.renderFile('./form.pug', {
                        path: req.url,
                        firstItem: '焼き肉',
                        secondItem: 'しゃぶしゃぶ'
                    }));
                } else if (req.url === '/enquetes/rice-bread') {
                    res.write(pug.renderFile('./form.pug', {
                        path: req.url,
                        firstItem: 'ごはん',
                        secondItem: 'パン'
                    }));
                } else if (req.url === '/enquetes/sushi-pizza') {
                    res.write(pug.renderFile('./form.pug', {
                        path: req.url,
                        firstItem: '寿司',
                        secondItem: 'ピザ'
                    }));
                }
                res.end();
                break;
            case 'POST':
                // res.write('POST ' + req.url);
                let rawData = '';
                req.on('data', (chunk) => {
                    rawData = rawData + chunk;
                }).on('end', () => {
                    // console.info('[' + now + '] Data posted: ' + rawData);
                    const decoded = decodeURIComponent(rawData);
                    const qs = require('querystring');
                    const answer = qs.parse(decoded);
                    // const res_answer = answer['name'] + 'さんは' + answer['yaki-shabu'] + 'に投票しました';
                    const res_answer = answer['name'] + 'さんは' + answer['favorite'] + 'に投票しました';
                    console.info('[' + now + ']: ' + decoded + ' => ' + res_answer);
                    res.write('<!DOCTYPE html><html lang="ja"><body><h1>' + res_answer + '</h1></body></html>');
                    res.end();
                });
                break;
            case 'DELETE':
                res.write('POST ' + req.url);
                break;
            default:
                break;
        }
    })
    .on('error', e => {
        console.error('[' + new Date() + '] Server Error', e);
    })
    .on('clientError', e => {
        console.error('[' + new Date() + '] Client Error', e);
    });
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.info('[' + new Date() + '] Listening on ' + port);
});