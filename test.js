var ddbrest = require('./index.js'),
    fs = require('fs');

var ddbrest = new ddbrest('gMsAKQW1jUHU9qw1T2YVlTpjDuxNYNa17NPDZ92EfdapnavHnNC1398598587284');

// ddbrest
//     .search('magdeburg')
//     .keywords('Foto')
//     .keywords('sdadsa')
//     .place('Heilbronn')
//     .get(5, 'ASC')
//     // .sector('sonstige')
//     .then(function(res){
//     	console.log(res);
//         // console.log(JSON.stringify(res));
//     }, function(){
//         console.log('fehler',arguments);
    // });

// test.binary('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF','mvpr/1.jpg').then(function(body,res) {
// 	console.log('clapp',body);
// }, function(err) {
// 	console.log('nöö');
// });

// test.binary('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF','mvpr/1.jpxg').toFile('nee.jpg').then(function(res) {
//     console.log(1,res);
// }, function(err) {
//     console.log(2,err);
// });

ddbrest.binary('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF','mvpr/1.jpg').get().then(function(res) {
    console.log('joo');
});

// var request = require('request');

// request.get('http://api.deutsche-digitale-bibliothek.de/binary/OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF/mvpr/1.jpg?oauth_consumer_key=gMsAKQW1jUHU9qw1T2YVlTpjDuxNYNa17NPDZ92EfdapnavHnNC1398598587284').pipe(fs.createWriteStream('doodle.png'));

// test.institutions('other').sectors().then(function(body) {
//     console.log(body);
// });

// test.search().facets('technical').then(function(body) {
// 	console.log(body);
// });

// test.items('OAXO2AGT7YH35YYHN3YKBXJMEI77W3FF').binaries().then(function(res) {
//     console.log(res);
// }, function(err) {
//     console.log(arguments);
// });