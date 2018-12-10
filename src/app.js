import React from 'react';
import ReactDOM from 'react-dom';
import Cliente from './cliente.js';

function Doge(){
    return (
        <pre>{`
                        
                ▌▒█           ▄▀▒▌
                ▌▒▒█        ▄▀▒▒▒▐
               ▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐
            ▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐
          ▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌
         ▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌
         ▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐
        ▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌
        ▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌
       ▌▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐
       ▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌
       ▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐
        ▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌
        ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐
         ▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌
           ▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀
              ▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀
                ▒▒▒▒▒▒▒▒▒▒▀▀      Wow, such empty.`}
        </pre>
    );
}


class FormularioNovoCliente extends React.Component{
    constructor(props){
        super(props);
        this.state = {'nome':'', 'data':'', 'saldo':''};
    }

    changeNome = (event) => { this.setState({'nome': event.target.value})}
    changeData = (event) => { this.setState({'data': event.target.value})}
    changeSaldo = (event) => { this.setState({'saldo': event.target.value})}    

    render(){
        return (
            <div className='cliente-formulario'>
                <label>Nome</label>
                <input name='nome' onChange={this.changeNome} ></input>
                <label>data de nascimento</label>
                <input name='data' onChange={this.changeData}></input>
                <label>saldo devedor</label>
                <input name='saldo' onChange={this.changeSaldo} ></input>
                <button onClick={() => this.props.novo(this.state.nome, this.state.data, this.state.saldo)}>Confirmar</button>
                <button onClick={this.props.close}> Cancelar </button>
            </div>
        );
    }
}

class App extends React.Component{
    constructor(props){
        super(props);

        this.http = new XMLHttpRequest();
        this.state = {'response': false, 'formularioOpen': false};
        // socilicitar os clientes para API
        this.http.onreadystatechange = () => {
            if(this.http.readyState === 4 && this.http.status === 200) {
                this.state.clientes = JSON.parse(this.http.responseText).clientes;
                this.setState({'response':  true});
            }
        }
        
        this.http.open('GET', '/clientes', true);
        this.http.send();
    }

    novoCliente = (nome, data, saldo) => {
        this.http.onreadystatechange = () => {
            if( this.http.readyState === 4 && this.http.status === 200){
                if( JSON.parse(this.http.responseText).erro ){
                    alert(JSON.parse(this.http.responseText).mensagemErro);
                    alert('erro');
                    return;
                }
                else{
                    // atualizar o estado
                    let clientes = this.state.clientes;
                    const id = JSON.parse(this.http.responseText).id;

                    clientes.push({'clienteID': id, 'nome': nome, 'dataNascimento': data, 'saldoDevedor': saldo});
                    this.setState({'clientes':clientes, 'formularioOpen': false});
                }
            }
        }

        this.http.open('POST', '/clientes', true);
        this.http.send(`{"nome": "${nome}", "dataNascimento":"${data}", "saldoDevedor":"${saldo}"}`);
    }

    render(){
        let clientes = '';
        if(this.state.response){
            if(this.state.clientes.length === 0){
                clientes = <Doge />;
            }
            else{
                clientes = this.state.clientes.map((value, index) => {
                    return <Cliente key={index} id={value.clienteID} nome={value.nome} saldo={value.saldoDevedor} ></Cliente>;
                });
            }
        }
        return (
            <div>
                <div className='clientes'>
                    { clientes }
                </div>
                { 
                    this.state.formularioOpen ?
                    <FormularioNovoCliente novo={this.novoCliente} close={() => this.setState({'formularioOpen':false})} /> :
                    <button onClick={() => this.setState({'formularioOpen': true})}>Cadastrar cliente</button>
                }
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));