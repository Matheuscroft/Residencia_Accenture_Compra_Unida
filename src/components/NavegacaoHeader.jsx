import React from "react";
import compraUnidaLogo from '../assets/compra-unida-logo.png';
import carrinhoIcon from '../assets/Carrinho.png';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const NavegacaoHeader = ({ handlePage, paginaAtual, userId, oferta }) => {


    const renderContent = () => {
        if ((paginaAtual === 'home-cliente' && userId) || paginaAtual === 'meus-pedidos' || paginaAtual === 'gerenciar-pedidos' || paginaAtual === 'carrinho' || (paginaAtual === 'contato' && userId)) {
            return (
                <>
                    <Button variant="link" onClick={() => handlePage('carrinho', { userId: userId, oferta: oferta })}>
                        <img src={carrinhoIcon} alt="Carrinho" width="30" height="30" />
                    </Button>
                    <Button style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => handlePage('meus-pedidos', { userId: userId })}>
                        Meus Pedidos
                    </Button>
                </>
            );
        } else if (paginaAtual === 'landing-page' || paginaAtual === 'contato' || paginaAtual === 'login' || paginaAtual === 'cadastro' || paginaAtual === 'home-cliente') {
            console.log("paginaAtual:")
            console.log(paginaAtual)
            return (
                <>
                    <Button className="me-2" style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => handlePage('login')}>Entrar</Button>
                    <Button style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => handlePage('cadastro')}>Cadastre-se</Button>
                </>
            );
        } else {

            console.log("userId do else do nav")
            console.log(userId)
            console.log("paginaAtual")
            console.log(paginaAtual)
            return (
                <>
                </>
            );
        }
    };

    return (
        <Navbar expand="lg" fixed="top" style={{ backgroundColor: '#1c3bc5' }}>
            <Container>
                <Navbar.Brand onClick={() => handlePage("landing-page")}>
                    <img
                        src={compraUnidaLogo}
                        alt="Logo Compra Unida"
                        width="65"
                        height="65"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {(paginaAtual === 'landing-page' || paginaAtual === 'login' || paginaAtual === 'cadastro' || (paginaAtual === 'contato' && userId === undefined) || (paginaAtual === 'home-cliente' && userId === undefined)) && (
                            <Nav.Link style={{ color: 'white' }} onClick={() => handlePage("landing-page")}>Início</Nav.Link>
                        )}
                        <Nav.Link style={{ color: 'white' }} onClick={() => handlePage("home-cliente", { userId: userId })}>Produtos</Nav.Link>
                        <Nav.Link style={{ color: 'white' }} onClick={() => handlePage("contato", { userId: userId })}>Contato</Nav.Link>
                    </Nav>
                    {renderContent()}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavegacaoHeader;