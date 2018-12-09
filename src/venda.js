import React from 'react';
import ReactDOM from 'react-dom';

class Venda extends React.Component{
    render(){
        return <li>valor: {this.props.valor}, data: {this.props.dataRealizacao}</li>
    }
}

class Formulario extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    confirmarVenda = () => {
        
    }

    changeValor = (event) => { this.setState({'valor': event.target.value})}
    changeData = (event) => { this.setState({'data': event.target.value})}
    changeSaldo = (event) => { this.setState({'saldo': event.target.value})}    

    render(){
        return (
            <div className='vendas-formulario'>
                <label>valor da venda</label>
                <input onChange={this.changeValor} ></input>
                <label>data de realização</label>
                <input onChange={this.changeData}></input>
                <label>saldo</label>
                <input onChange={this.changeSaldo} ></input>
                <button onClick={() => this.props.nova(this.state.valor, this.state.data, this.state.saldo)}>Confirmar</button>
            </div>
        );
    }
}

class Vendas extends React.Component{
    constructor(props){
        super(props);
        this.state = {'form': false};
    }
    render(){
        let vendas = '';
        if(this.props.vendas.length !== 0){
            vendas = this.props.vendas.map((value, index) => {
                return <Venda key={index} valor={value.valor} dataRealizacao={value.dataRealizacao}></Venda>
            });
        }
        else{
            vendas = <p>nenhuma venda cadastrada</p>;
        }
        return (
            <div className='modal-wrapper'>
                <div className='modal-vendas'>
                    <div className='vendas'>
                        {vendas}
                    </div>
                    { 
                        this.state.form ?
                        <Formulario nova={this.props.nova} close={this.props.close} /> :
                        <button onClick={() => this.setState({'form': true})}>Nova venda</button>    
                    }
                    <button onClick={this.props.close} >Fechar</button>
                </div>
            </div>

        );
    }
}

export {Vendas, Venda, Formulario};
