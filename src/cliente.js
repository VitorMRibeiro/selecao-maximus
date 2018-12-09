import React from 'react';
import ReactDOM from 'react-dom';
import {Vendas, Venda, Formulario} from './venda.js';

class Cliente extends React.Component{
    constructor(props){
        super(props);
        this.state = {'vendas':[], 'vendasOpen': false, 'init': false};
        this.http = new XMLHttpRequest();
    }

    sendHTTP = (method, req, body, callback) => {
        this.http.open(method, req, true);
        this.http.send(body);
        this.http.onreadystatechange = callback;
    }

    inserirVendaOrdem = (valor, dataRealizacao, saldo) => {
        let vendas = this.state.vendas;
        // colocar a venda em ordem de data
        const indice = vandas.findIndex((value) => {
            const newDate = new Date(dataRealizacao);
            const existingDate = new Date(value.dataRealizacao);
            if( newDate > existingDate) return true;
        })
        vendas.splice(indice, 0, {'valor':valor, 'dataRealizacao':dataRealizacao, 'saldo': saldo});
        this.setState({'vendas': vendas});
    }

    novaVenda = (valor, dataRealizacao, saldo) => {
        // atualizar o BD
        this.sendHTTP('POST', '/vendas/' + this.props.id, `{"valor": "${valor}", "dataRealizacao": "${dataRealizacao}", "saldo": "${saldo}"}`, () => {
            if(this.http.readyState === 4 && this.http.status === 200){
                if( this.http.responseText !== '' ){
                    alert(this.http.responseText);
                    return;
                }
                inserirVendaOrdem(valor, dataRealizacao, saldo);
                // atualizar saldo do cliente
                this.sendHTTP('PUT', '/clientes/' + this.props.id, `{"saldoDevedor": ${this.props.saldo + saldo}}`, () => {});
            }
        });
    }

    buscarVendas = () => {
        if(!this.state.init){
            this.sendHTTP('GET', '/vendas/' + this.props.id, '', () => {
                if(this.http.readyState === 4 && this.http.status === 200){
                    let response = JSON.parse(this.http.responseText);
                    this.setState({'vendas':response, 'vendasOpen': true, 'init': true});
                }
            });
        }
        else{
            this.setState({'vendasOpen': true});
        }
    }

    closeVendas = () => {
        this.setState({'vendasOpen': false});
    }

    render(){
        return (
            <div>
                <div onClick={this.buscarVendas} className='cliente'>
                    <span className='cliente-id'>id: {this.props.id}</span>
                    <span className='cliente-nome'>nome: {this.props.nome}</span>
                    <span className='cliente-saldo'>saldo: {this.props.saldo}</span>
                </div>
                { this.state.vendasOpen ? <Vendas nova={this.novaVenda} close={this.closeVendas} vendas={this.state.vendas}></Vendas> : ''}
            </div>
        );
    }
}

export default Cliente;