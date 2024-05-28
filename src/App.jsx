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
import HomeCliente from './components/HomeCliente'; // Corrected import
import Produto from './components/Produto'; // Corrected import

const App = () => {
    const [paginaAtual, setPaginaAtual] = useState({ page: "landing", data: null });

    const handlePage = (page, data = null) => {
        setPaginaAtual({ page, data });
    };

    switch (paginaAtual.page) {
        case "login":
            return <Login handlePage={handlePage} />;
        case "cadastro-fornecedor":
            return <CadastroFornecedor handlePage={handlePage} />;
        case "home-fornecedor":
            return <HomeFornecedor handlePage={handlePage} />;
        case "cadastro-cliente":
            return <CadastroCliente handlePage={handlePage} />;
        case "cadastro":
            return <Cadastro handlePage={handlePage} />;
        case "posts":
            return <Posts />;
        case "mensagens":
            return <Mensagens />;
        case "criar-oferta":
            return <CriarOferta handlePage={handlePage} />;
        case "criar-produto":
            return <CriarProduto handlePage={handlePage} />;
        case "home-cliente":
            return <HomeCliente handlePage={handlePage} />;
        case "produto":
            return <Produto handlePage={handlePage} produto={paginaAtual.data} />;
        default:
            return <LandingPage handlePage={handlePage} />;
    }
};

export default App;
