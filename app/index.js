const express = require('express');
const bodyParser = require('body-parser');
//gets index js file by default
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');

//in case user specifies port
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

//use for post requests
app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res)=> {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`)

    p2pServer.syncChains();
    
    res.redirect('/blocks');
})

app.listen(HTTP_PORT, ()=> console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();