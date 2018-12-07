const mysql = require('mysql');

const connection = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : '123',
    database : 'test'
})

// criar as tabelas

// tabela de cliente
connection.query("CREATE TABLE IF NOT EXISTS cliente ( clienteID int AUTO_INCREMENT, nome varchar(200), dataNascimento date, saldoDevedor varchar(20) DEFAULT '0', PRIMARY KEY (clienteID))", 
    (err, results, fields) => { if (err) throw err });

// tabela de vendas
connection.query('CREATE TABLE IF NOT EXISTS  venda ( clienteID int, valor varchar(20), dataRealizacao date, saldo varchar(20), KEY FK (clienteID))', 
    (err, results, fields) => { if (err) throw err });


function criarCliente(nome, dataNascimento, saldoDevedor){
    connection.query(`INSERT INTO cliente (nome, dataNascimento, saldoDevedor) VALUES ('${nome}', '${dataNascimento}', '${saldoDevedor}')`, 
        (err, results, fields) => { if (err) throw err });
}

function retornarClientes(writebleStream, callback){
    connection.query('SELECT * FROM cliente', (err, results, fields) => {
        if (err) throw err;
        writebleStream.write(JSON.stringify(results));
        callback();
    });
}

function atualizarCliente( clienteID, nome, dataNascimento, saldoDevedor){
    if(!(nome || dataNascimento || saldoDevedor)) return;

    // monta a query string atualizando apenas os valores das colunas que foram passadas como parametro.
    const setNome = nome ? ('nome = ' + "'" + nome + "'") : '';
    const setDataNascimento = dataNascimento ? ( (nome ? ', ' : ' ') + 'dataNascimento = ' + "'" + dataNascimento + "'") : ' ';
    const setSaldoDevedor = saldoDevedor ? (((dataNascimento || nome) ? ', ' : ' ') + 'saldoDevedor = ' + "'" + saldoDevedor + "' ") : '';
    const queryString = 'UPDATE cliente SET ' + setNome + setDataNascimento + setSaldoDevedor + 'WHERE clientID = ' + clienteID;

    connection.query(queryString, (err) => {if(err) throw err} );
}

function deletarCliente(clienteID){
    connection.query(`DELETE FROM cliente WHERE clienteID = ${clienteID}`, (err) => {if(err) throw err});
}

function retornarVendas(clienteID, writebleStream, callback){
    connection.query(`SELECT cliente.clienteID, valor, dataRealizacao, saldo FROM cliente JOIN venda ON cliente.clienteID = venda.clienteID WHERE cliente.clienteID = ${clienteID} ORDER BY dataRealizacao`, (err, results) => {
        writebleStream.write(JSON.stringify(results));
        callback();
    });
}

function criarVenda(clienteID, valor, dataRealizacao, saldo){
    connection.query(`INSERT INTO venda (clienteID, valor, dataRealizacao, saldo) VALUES (${clienteID}, '${valor}', '${dataRealizacao}', '${saldo}')`);
}

function connect(){
    console.log('connect');
    // connection.connect();
}

function end(){
    connection.end();
}

module.exports = {criarCliente, retornarClientes, atualizarCliente, deletarCliente, retornarVendas, criarVenda, connect, end};