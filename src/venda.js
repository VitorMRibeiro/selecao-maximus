import React from 'react';
import ReactDOM from 'react-dom';

class Venda extends React.Component{
    render(){
        return (
            <div className='row'>
                <span className='row-valor'>{this.props.valor}</span>
                <span className='row-data'>{this.props.dataRealizacao.split('T')[0]}</span>
            </div>
        );
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
            <div>
                <div className='vendas-formulario'>
                    <label>valor da venda</label>
                    <input name='valor' onChange={this.changeValor} ></input>
                    <label>data de realização</label>
                    <input name='data' onChange={this.changeData}></input>
                    <label>saldo</label>
                    <input name='saldo' onChange={this.changeSaldo} ></input>
                </div>
                <div className='venda-btns'>
                    <button className='venda-btn' onClick={this.props.close}> Cancelar </button>
                    <button className='venda-btn' onClick={this.confirmar}> Confirmar </button>
                </div>
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
        let colNames = '';
        if(this.props.vendas.length !== 0){
            vendas = this.props.vendas.map((value, index) => {
                return <Venda key={index} valor={value.valor} dataRealizacao={value.dataRealizacao}></Venda>
            });
            colNames = <div className="row col-names"><span className='row-valor'>valor</span><span className='row-data'>data</span></div>;
        }
        else{
            vendas = <p className='noVendas'>nenhuma venda cadastrada</p>;
        }
        return (
            <div className='modal-wrapper'>
                <div className='modal-vendas'>
                    <div className='vendas'>
                        {colNames}
                        {vendas}
                    </div>
                    { 
                        this.state.form ?
                        <Formulario nova={this.props.nova} closeModal={this.props.close} close={() => this.setState({'form':false})} /> :
                        <div className='venda-btns'>
                            <button className='venda-btn' onClick={this.props.close} >Fechar</button>
                            <button className='venda-btn' onClick={() => this.setState({'form': true})}>Nova venda</button>    
                        </div>
                    }
                </div>
            </div>

        );
    }
}

export {Vendas, Venda, Formulario};
