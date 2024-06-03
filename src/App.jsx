import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Cadastro from './components/Cadastro';
import CriarOferta from './components/CriarOferta';
import Login from './components/Login';
import CadastroCliente from './components/CadastroCliente';
import CadastroFornecedor from './components/CadastroFornecedor';
import HomeFornecedor from './components/HomeFornecedor';
import CriarProduto from './components/CriarProduto';
import HomeCliente from './components/HomeCliente';
import Produto from './components/Produto';
import NavegacaoHeader from './components/NavegacaoHeader';
import Carrinho from './components/Carrinho';
import MeusPedidos from './components/MeusPedidos';
import EsqueciSenha from './components/EsqueciSenha';
import Paineis from './components/Paineis';
import GerenciarPedidos from './components/GerenciarPedidos';

const App = () => {
    const [carrinho, setCarrinho] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState({ page: "landing", data: null });

    const addToCart = (produto) => {
        setCarrinho([...carrinho, produto]);
    };

    const handlePage = (page, data = null) => {
        setPaginaAtual({ page, data });
    };

    switch (paginaAtual.page) {
        case "login":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <Login handlePage={handlePage} />
                </div>
            );
        case "cadastro-fornecedor":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <CadastroFornecedor handlePage={handlePage} />
                </div>
            );
        case "home-fornecedor":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <HomeFornecedor handlePage={handlePage} userId={paginaAtual.data.userId}/>
                </div>
            );
        case "cadastro-cliente":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <CadastroCliente handlePage={handlePage} />
                </div>
            );
        case "cadastro":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <Cadastro handlePage={handlePage} />
                </div>
            );
        case "esqueci-senha":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <EsqueciSenha />
                </div>
            );

        case "criar-oferta":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <CriarOferta handlePage={handlePage} userId={paginaAtual.data.userId}/>
                </div>
            );
        case "criar-produto":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <CriarProduto handlePage={handlePage} userId={paginaAtual.data.userId}/>
                </div>
            );
        case "home-cliente":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <HomeCliente addToCart={addToCart} handlePage={handlePage} />
                </div>
            );
        case "produto":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <Produto handlePage={handlePage} produto={paginaAtual.data} />
                </div>
            );
        case "carrinho":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <Carrinho handlePage={handlePage} oferta={paginaAtual.data} />
                </div>
            );
        case "meus-pedidos":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <MeusPedidos handlePage={handlePage} />
                </div>
            );
        case "gerenciar-pedidos":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <GerenciarPedidos handlePage={handlePage} userId={paginaAtual.data.userId}/>
                </div>
            );
        case "paineis":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <Paineis handlePage={handlePage} userId={paginaAtual.data.userId}/>
                </div>
            );
        default:
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
                    <LandingPage handlePage={handlePage} />
                </div>
            );
    }
};

export default App;

