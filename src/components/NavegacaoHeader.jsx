import React from "react";
import compraUnidaLogo from '../assets/compra-unida-logo.png';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const NavegacaoHeader = (props) => {
    return (
        <Navbar expand="lg" fixed="top" style={{ backgroundColor: '#1c3bc5' }}>
            <Container>
                <Navbar.Brand href="google.com">
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
                        <Nav.Link href="google.com" style={{ color: 'white' }}>Home</Nav.Link>
                        <Nav.Link style={{ color: 'white' }} onClick={() => props.handlePage("home-cliente")}>Produtos</Nav.Link>
                        <Nav.Link href="google.com" style={{ color: 'white' }}>Contato</Nav.Link>
                    </Nav>
                    <Button className="me-2" style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => props.handlePage("login")}>Entrar</Button>
                    <Button style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => props.handlePage("cadastro")}>Cadastre-se</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavegacaoHeader;