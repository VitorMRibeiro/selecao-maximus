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
        this.state = {'valor':'', 'data':'', 'saldo':''};
    }

    changeValor = (event) => { this.setState({'valor': event.target.value})}
    changeData = (event) => { this.setState({'data': event.target.value})}
    changeSaldo = (event) => { this.setState({'saldo': event.target.value})}    

    confirmar = () => {
        this.props.nova(this.state.valor, this.state.data, this.state.saldo);
        this.props.closeModal();
    }

    render(){
        return (
            <div className='vendas-formulario'>
                <label>valor da venda</label>
                <input name='valor' onChange={this.changeValor} ></input>
                <label>data de realização</label>
                <input name='data' onChange={this.changeData}></input>
                <label>saldo</label>
                <input name='saldo' onChange={this.changeSaldo} ></input>
                <button onClick={this.props.close}> Cancelar </button>
                <button onClick={this.confirmar}> Confirmar </button>
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
                        <Formulario nova={this.props.nova} closeModal={this.props.close} close={() => this.setState({'form':false})} /> :
                        <button onClick={() => this.setState({'form': true})}>Nova venda</button>    
                    }
                    <button onClick={this.props.close} >Fechar</button>
                </div>
            </div>

        );
    }
}

export {Vendas, Venda, Formulario};
