const http = require('http');
const express = require('express');
const BD = require('./interfaceBD');

const formatoSaldo = /^(R\$|US\$|\$|€|¥|£)\s?-?[0-9]+(,[0-9]+)?$/;
const formatoData = /^[0-9]{4}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/;

const server = express();

// retornar todos os clientes
server.get('/clientes', (req, res) => {
    res.write('{ "clientes":');
    BD.retornarClientes(res, () => {
        res.end('}');
    })
});

// criar um cliente
server.post('/clientes', (req, res) => {
    req.setEncoding('utf-8');
    // processar o corpo do request.
    req.on('data', (chunk) => {
        let clienteInfo = validarJSON(chunk, res);
        if(clienteInfo === null) return;

        retornarErro(clienteInfo.nome === undefined, res, "atributo 'nome' está faltando");
        retornarErro(!formatoData.test(clienteInfo.dataNascimento), res, 'dataNascimento - formato inválido, tente YYYY-MM-DD');
        retornarErro(!formatoSaldo.test(clienteInfo.saldoDevedor), res, "saldoDevedor - formato inválido, exemplo de saldo válido: 'R$ 200'");
        
        BD.criarCliente(clienteInfo.nome, clienteInfo.dataNascimento, clienteInfo.saldoDevedor);
    });

    req.on('end', () => {
        res.status(200);
        res.end();
    });
});

// atualizar o cliente
server.put(/\/clientes\/[0-9]+/, (req, res) => {
    const clienteID = getClienteID(req.url);

    req.on('data', (chunk) => {
        let clienteInfo = validarJSON(chunk, res);
        if(clienteInfo === null) return;

        retornarErro(!(clienteInfo.dataNascimento === undefined || formatoData.test(clienteInfo.dataNascimento)), res, 'dataNascimento - formato inválido, tente YYYY-MM-DD');
        retornarErro(!(clienteInfo.saldoDevedor === undefined || formatoSaldo.test(clienteInfo.saldoDevedor)), res, "saldoDevedor - formato inválido, exemplo de saldo válido: 'R$ 200'");

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
        let vendaInfo = validarJSON(chunk, res);
        if(vendaInfo === null) return;

        retornarErro(!(formatoSaldo.test(vendaInfo.valor)), res, "valor - formato inválido, exemplo de saldo válido: 'R$ 200'");
        retornarErro(!(formatoData.test(vendaInfo.dataRealizacao)), res, 'dataRealizacao - formato inválido, tente YYYY-MM-DD');
        retornarErro(!(formatoSaldo.test(vendaInfo.saldo)), res, "valor - formato inválido, exemplo de saldo válido: 'R$ 200'");
        
        BD.criarVenda(clienteID, vendaInfo.valor, vendaInfo.dataRealizacao, vendaInfo.saldo);    
        // TODO atualizar o saldo do cliente.
    })

    req.on('end', () => {
        res.status(200);
        res.end();
    })
});

server.listen(80, '127.0.0.1', () => {
    console.log('listening on port 80...');
})

function getClienteID(url){
    return parseInt(url.match(/[0-9]+$/));
}

function validarJSON(chunk, res){
    res.setHeader('content-type', 'text/plain');
    let jsonValido;
    try {
        jsonValido = JSON.parse(chunk);
    } catch (error) {
        res.status(400);            
        res.end('JSON inválido');
        return null;            
    }
    return jsonValido;
}

function retornarErro(guard, res, mensagemErro){
    if(guard){
        res.status(400);
        res.end(mensagemErro);
    }
}

