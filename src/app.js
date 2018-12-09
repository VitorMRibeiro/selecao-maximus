import React from 'react';
import ReactDOM from 'react-dom';
import Cliente from './cliente.js';

function Doge(){
    return (
        <pre>
                                         
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
                   ▒▒▒▒▒▒▒▒▒▒▀▀      Wow, such empty.
        </pre>
    );
}

class App extends React.Component{
    constructor(props){
        super(props);

        this.http = new XMLHttpRequest();
        this.state = {'response': false};
        // socilicitar os clientes para API
        this.http.open('GET', '/clientes', true);
        this.http.send();
        this.http.onreadystatechange = () => {
            if(this.http.readyState === 4 && this.http.status === 200) {
                this.response = JSON.parse(this.http.responseText);
                this.setState({'response':  true});
            }
        }
    }

    novoCliente = () => {
        // atualizar o estado
        // atualizar o BD
    }

    render(){
        let clientes = '';
        if(this.state.response){
            if(this.response.clientes.length === 0){
                clientes = <Doge />;
            }
            else{
                clientes = this.response.clientes.map((value, index) => {
                    return <Cliente key={index} id={value.clienteID} nome={value.nome} saldo={value.saldoDevedor} ></Cliente>;
                });
            }
        }
        return (
            <div>
                <div className='clientes'>
                    { clientes }
                </div>
                <button>Cadastrar cliente</button>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));