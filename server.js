const http = require('http');
const express = require('express');
const BD = require('./interfaceBD');

// checar se o saldo fornecido está no formato correto
const formatoSaldo = /^(R\$|US\$|\$|€|¥|£)\s?-?[0-9]+(,[0-9]+)?$/;

const server = express();

server.get('/clientes', (req, res) => {
    // retornar todos os clientes
});

server.post('/clientes', (req, res) => {
    // criar um cliente
});

server.put(/\/clientes\/[0-9]+/, (req, res) => {
    // atualizar o cliente
});

server.delete(/\/clientes\/[0-9]+/, (req, res) => {
    // remover o cliente
});

server.get(/\/vendas\/[0-9]+/, (req, res) => {
    // retornar vendas realizadas pelo cliente
});

server.post(/\/vendas\/[0-9]+/, (req, res) => {
    // criar venda e especificar o cliente
});

server.listen(80, '127.0.0.1', () => {
    console.log('listening on port 80...');
})