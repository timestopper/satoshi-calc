var express = require('express')
var fetch = require('node-fetch')
var path = require('path')
var port = 3000//process.env.PORT || 8080

var https = require('https');
var fs = require('fs');
var app = express()

//app.use('/bcalc', express.static('public'))
app.use(express.static('public'))


app.get('/getbtcchangerate', function (req, res) {

	var reqUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=' + req.query.currency;
	var btc = req.query.btc,
		curr = req.query.currency,
		k = req.query.k;

	fetch(reqUrl, { 
	    method: 'GET'
	})
	    .then(function(res) { return res.json()})
	    .then(function(result) {
	    	console.log(result)

		    var kurs = result.RAW.BTC[curr].PRICE;
		    var CHANGE24HOUR = result.DISPLAY.BTC[curr].CHANGE24HOUR;
		    var CHANGEPCT24HOUR = result.DISPLAY.BTC[curr].CHANGEPCT24HOUR;
		    var changeValRaw = result.RAW.BTC[curr].CHANGE24HOUR;
		    var result1 = kurs*k*btc;

		    var a
		    if (result1 < 1.1 && result1 != 0) {
		      a=8;// result1 = result1.toFixed(8);
		    } else {
		      a=2;// result1 = result1.toFixed(2);
		    }

		    var resObj = {kurs: kurs, CHANGE24HOUR: CHANGE24HOUR, CHANGEPCT24HOUR: CHANGEPCT24HOUR, changeValRaw: changeValRaw, result1: result1, a:a}

			res.status(200).json(resObj)
	    })
	    .catch(function(err) {
	    	res.status(500).json(err)
	    })

});

app.get('/getbtcdata', function (req, res) {

	var reqUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=' + req.query.currency

	var curr = req.query.currency,
		val = req.query.val,
		k = req.query.k;

	fetch(reqUrl, { 
	    method: 'GET'
	})
	    .then(function(res){return res.json()})
	    .then(function(result){
	    	console.log(result)

		    var kurs = result.RAW.BTC[curr].PRICE;
		    var income1 = val/(kurs*k);

		    var b
		    if (income1 < 0.01 && income1 != 0 ) {
		      b=8;
		    } else {
		      b=2;
		    }
		    var resObj = {kurs: kurs, income1: income1, b:b}
			res.status(200).json(resObj)
	    })
	    .catch( function(err) {
	    	res.status(500).json(err)
	    })

});



// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem'),
  
//   // only required if used while certificate creation
//   passphrase: 'bcalc'
// };

// *** start SSL part ***

var sslCA = []
    , cert = []
    , line
    , endCertPt = /-END CERTIFICATE-/
    , chain = fs.readFileSync( path.join(__dirname, 'SSL_prod/gd_bundle-g2-g1.crt'), 'utf8' );

chain = chain.split('\n');
for (line in chain) {
    if ( chain[line].length != 0 ) {
        cert.push( chain[line] )
    }
    if ( endCertPt.test( chain[line] ) ) {
        sslCA.push( cert.join('\n') );
        cert = [];
    }
}

var sslOptions = { 'key' : fs.readFileSync( path.join(__dirname, 'SSL_prod/server.key'), 'utf8' )
                  ,'cert': fs.readFileSync( path.join(__dirname, 'SSL_prod/server.crt'), 'utf8' )
                  , 'ca': sslCA
                  , 'requestCert': true
                  , 'rejectUnauthorized': false
                  , 'passphrase': 'bcalc' };
// *** end SSL part ***

https.createServer(sslOptions, app).listen(port);

//app.listen(port);
console.log("server started on port " + port);