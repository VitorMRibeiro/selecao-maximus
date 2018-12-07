const http = require('http');
const BD = require('./interfaceBD');

// checar se o saldo fornecido está no formato correto
const formatoSaldo = /^(R\$|US\$|\$|€|¥|£)\s?-?[0-9]+(,[0-9]+)?$/;

// BD.connect();

const server = http.createServer((req, res) => {
        res.write('{');
        BD.retornarVendas(1, res, () => {
            res.end('}');
        });
});

server.listen(80, '127.0.0.1');