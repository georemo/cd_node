// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const app = express();

// Certificate
const privateKey = fs.readFileSync('/home/emp-03/corpdesk_net_pk_01.key', 'utf8');
const certificate = fs.readFileSync('/home/emp-03/corpdesk_net.crt', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate
	//ca: ca
};

app.use((req, res) => {
	res.send('Hello there !');
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(3003, () => {
	console.log('HTTP Server running on port 3003');
});

httpsServer.listen(3004, () => {
	console.log('HTTPS Server running on port 3004');
});