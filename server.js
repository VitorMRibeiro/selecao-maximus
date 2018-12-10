const http = require('http');
const fs = require('fs');
const express = require('express');
const BD = require('./interfaceBD');

const formatoSaldo = /^(R\$|US\$|\$|€|¥|£)\s?-?[0-9]+(,[0-9]+)?$/;
const formatoData = /^[0-9]{4}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/;

const server = express();

// home
server.get('', (req, res) => {
    fs.readFile('./public/index.html', (err, data) => {
        if(err) throw err;
        
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(data);
    })
});

// retornar todos os clientes
server.get('/clientes', (req, res) => {
    res.writeHead(200, {'content-type': 'application/json'})
    res.write('{ "clientes":');
    BD.retornarClientes(res, () => {
        res.end('}');
    })
});

// criar um cliente
server.post('/clientes', (req, res) => {
    req.setEncoding('utf-8');
    res.writeHead(200, {'conent-type': 'application/json'});
    // processar o corpo do request.
    req.on('data', (chunk) => {
        let clienteInfo;
        if(retornarErro(!(clienteInfo = JSON.parse(chunk)), res, 'JSON invalido')) return;
        if(retornarErro(!clienteInfo.nome , res, "nome - atributo faltando")) return;
        if(retornarErro(!clienteInfo.dataNascimento , res, 'dataNascimento - atributo faltando')) return;
        if(retornarErro(!clienteInfo.saldoDevedor , res, "saldoDevedor - atributo faltando")) return;
        if(retornarErro(!formatoData.test(clienteInfo.dataNascimento), res, 'dataNascimento - formato inválido, tente YYYY-MM-DD')) return;
        if(retornarErro(!formatoSaldo.test(clienteInfo.saldoDevedor), res, "saldoDevedor - formato inválido, exemplo de saldo válido: 'R$ 200'")) return;
        
        BD.criarCliente(clienteInfo.nome, clienteInfo.dataNascimento, clienteInfo.saldoDevedor, res, () => res.end());
    });
});

// atualizar o cliente
server.put(/\/clientes\/[0-9]+/, (req, res) => {
    const clienteID = getClienteID(req.url);

    req.on('data', (chunk) => {
        let clienteInfo;
        if(retornarErro(!(clienteInfo = JSON.parse(chunk)), res, 'JSON invalido')) return;
        if(retornarErro(!(clienteInfo.dataNascimento  || formatoData.test(clienteInfo.dataNascimento)), res, 'dataNascimento - formato inválido, tente YYYY-MM-DD')) return;
        if(retornarErro(!(clienteInfo.saldoDevedor  || formatoSaldo.test(clienteInfo.saldoDevedor)), res, "saldoDevedor - formato inválido, exemplo de saldo válido: 'R$ 200'")) return;

        BD.atualizarCliente(clienteID, clienteInfo.nome, clienteInfo.dataNascimento, clienteInfo.saldoDevedor);
    });

    req.on('end', () => {
        res.status(200);
        res.end();
    })
});

// remover o cliente
server.delete(/\/clientes\/[0-9]+/, (req, res) => {
    const clienteID = getClienteID(req.url);
    BD.deletarCliente(clienteID);
    res.end();
});

// retornar vendas realizadas pelo cliente
server.get(/\/vendas\/[0-9]+/, (req, res) => {
    const clienteID = getClienteID(req.url);
    BD.retornarVendas(clienteID, res, () => {
        res.end();
    });
});

// criar venda e especificar o cliente
server.post(/\/vendas\/[0-9]+/, (req, res) => {
    const clienteID = getClienteID(req.url);

    req.on('data', (chunk) => {
        let vendaInfo;
        if(retornarErro(!(vendaInfo = JSON.parse(chunk)), res, 'JSON invalido')) return;
        if(retornarErro(!vendaInfo.valor , res, "valor - atributo faltando")) return;
        if(retornarErro(!vendaInfo.dataRealizacao , res, 'dataRealizacao - atributo faltando')) return;
        if(retornarErro(!vendaInfo.saldo , res, "saldo - atributo faltando")) return;
        if(retornarErro(!(formatoSaldo.test(vendaInfo.valor)), res, "valor - formato inválido, exemplo de saldo válido: 'R$ 200'")) return;
        if(retornarErro(!(formatoData.test(vendaInfo.dataRealizacao)), res, 'dataRealizacao - formato inválido, tente YYYY-MM-DD')) return;
        if(retornarErro(!(formatoSaldo.test(vendaInfo.saldo)), res, "saldo - formato inválido, exemplo de saldo válido: 'R$ 200'")) return;
        
        BD.criarVenda(clienteID, vendaInfo.valor, vendaInfo.dataRealizacao, vendaInfo.saldo);    
        // TODO atualizar o saldo do cliente.
        BD.atualizarCliente(clienteID, undefined, undefined, vendaInfo.saldo);
    })

    req.on('end', () => {
        res.status(200);
        res.end('{}');
    })
});

server.get(/.*\.(css|js)$/, (req, res) => {
    let extensao = req.url.split('.').pop();

    switch (extensao) {
        case 'css':
            res.writeHead(200, {'content-type':'text/css'});
            break;
        case 'js':
            res.writeHead(200, {'content-type': 'application/js'});
            break;
        default:
            res.writeHead(200, {'content-type': 'text/plain'});
            break;
    }

    fs.readFile('.' + req.url, (err, data) => {
        if(err !== null){
            res.status(404);
            res.end();
        }
        res.end(data);
    });  
});

server.listen(80, '127.0.0.1', () => {
    console.log('listening on port 80...');
})

function getClienteID(url){
    return parseInt(url.match(/[0-9]+$/));
}

function retornarErro(guard, res, mensagemErro){
    if(guard){
        res.end(`{"erro": true, "mensagemErro": "${mensagemErro}"}`);
        return true;
    }
    return false;
}

