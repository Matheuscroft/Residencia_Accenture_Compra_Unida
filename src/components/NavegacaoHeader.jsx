import React from "react";
import compraUnidaLogo from '../assets/compra-unida-logo.png';
import styled from "styled-components";
import { Button } from 'react-bootstrap';
import { HeaderStyle, NavBarStyle, Logo, Links, Botao } from "./Estilos";


const NavegacaoHeader = (props) => {

    return (
        <HeaderStyle>
            <NavBarStyle>
                <a href="google.com">
                    <Logo src={compraUnidaLogo} alt="Logo Compra Unida" />
                </a>
                <Links href="google.com">Home</Links>
                <Links href="google.com">Produtos</Links>
                <Links href="google.com">Contato</Links>
                <Botao onClick={() => props.handlePage("home")}>Fazer NavegacaoHeader</Botao>
                <Botao onClick={() => props.handlePage("cadastro")}>Cadastre-se</Botao>
                <Button>MEU BOTAO</Button>
            </NavBarStyle>
        </HeaderStyle>
    )
}

export default NavegacaoHeader