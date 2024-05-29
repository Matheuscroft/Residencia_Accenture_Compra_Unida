import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Cadastro from './components/Cadastro';
import Posts from './components/Posts';
import Mensagens from './components/Mensagens';
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

const App = () => {
    const [paginaAtual, setPaginaAtual] = useState({ page: "landing", data: null });

    const handlePage = (page, data = null) => {
        setPaginaAtual({ page, data });
    };

    switch (paginaAtual.page) {
        case "login":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <Login handlePage={handlePage} />
                </div>
            )
        case "cadastro-fornecedor":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <CadastroFornecedor handlePage={handlePage} />
                </div>
            )
        case "home-fornecedor":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <HomeFornecedor handlePage={handlePage} />
                </div>
            )
        case "cadastro-cliente":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <CadastroCliente handlePage={handlePage} />
                </div>
            )
        case "cadastro":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <Cadastro handlePage={handlePage} />
                </div>
            )
        case "posts":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <Posts />
                </div>
            )
        case "mensagens":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <Mensagens />
                </div>
            )
        case "criar-oferta":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <CriarOferta handlePage={handlePage} />
                </div>
            )
        case "criar-produto":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <CriarProduto handlePage={handlePage} />
                </div>
            )
        case "home-cliente":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <HomeCliente handlePage={handlePage} />
                </div>
            )
        case "produto":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <Produto handlePage={handlePage} produto={paginaAtual.data} />
                </div>
            )
        case "carrinho":
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <Carrinho handlePage={handlePage} />
                </div>
            )
        default:
            return (
                <div>
                    <NavegacaoHeader handlePage={handlePage} />
                    <LandingPage handlePage={handlePage} />
                </div>
            )
    }
};

export default App;
