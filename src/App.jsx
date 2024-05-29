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
import NavegacaoHeaderCliente from './components/NavegacaoHeaderCliente';
import Carrinho from './components/Carrinho';
import MeusPedidos from './components/MeusPedidos';
import EsqueciSenha from './components/EsqueciSenha';

const App = () => {
    const [carrinho, setCarrinho] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState({ page: "landing", data: null });

    const addToCart = (produto) => {
        setCarrinho([...carrinho, produto]);
    };

    const handlePage = (page, data = null) => {
        setPaginaAtual({ page, data });
    };

    return (
        <div>
            {paginaAtual.page === "home-cliente" ? (
                <NavegacaoHeaderCliente handlePage={handlePage} paginaAtual={paginaAtual.page} />
            ) : (
                <NavegacaoHeader handlePage={handlePage} paginaAtual={paginaAtual.page} />
            )}
            {(() => {
                switch (paginaAtual.page) {
                    case "login":
                        return (
                            <div>
                                <Login handlePage={handlePage} />
                            </div>
                        );
                    case "cadastro-fornecedor":
                        return (
                            <div>
                                <CadastroFornecedor handlePage={handlePage} />
                            </div>
                        );
                    case "home-fornecedor":
                        return (
                            <div>
                                <HomeFornecedor handlePage={handlePage} />
                            </div>
                        );
                    case "cadastro-cliente":
                        return (
                            <div>
                                <CadastroCliente handlePage={handlePage} />
                            </div>
                        );
                    case "cadastro":
                        return (
                            <div>
                                <Cadastro handlePage={handlePage} />
                            </div>
                        );
                    case "esqueci-senha":
                        return (
                            <div>
                                <EsqueciSenha />
                            </div>
                        );
                    case "posts":
                        return (
                            <div>
                                <Posts />
                            </div>
                        );
                    case "mensagens":
                        return (
                            <div>
                                <Mensagens />
                            </div>
                        );
                    case "criar-oferta":
                        return (
                            <div>
                                <CriarOferta handlePage={handlePage} />
                            </div>
                        );
                    case "criar-produto":
                        return (
                            <div>
                                <CriarProduto handlePage={handlePage} />
                            </div>
                        );
                    case "home-cliente":
                        return (
                            <div>
                                <HomeCliente addToCart={addToCart} handlePage={handlePage} />
                            </div>
                        );
                    case "produto":
                        return (
                            <div>
                                <Produto handlePage={handlePage} produto={paginaAtual.data} />
                            </div>
                        );
                    case "carrinho":
                        return (
                            <div>
                                <Carrinho handlePage={handlePage} oferta={paginaAtual.data} />
                            </div>
                        );
                    case "meus-pedidos":
                        return (
                            <div>
                                <MeusPedidos handlePage={handlePage} />
                            </div>
                        );
                    case "gerenciar-pedidos":
                        return (
                            <div>
                                <MeusPedidos handlePage={handlePage} />
                            </div>
                        );
                    default:
                        return (
                            <div>
                                <LandingPage handlePage={handlePage} />
                            </div>
                        );
                }
            })()}
        </div>
    );
};

export default App;

