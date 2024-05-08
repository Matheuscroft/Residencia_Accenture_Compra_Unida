import React from "react";
import compraUnidaLogo from '../assets/compra-unida-logo.png';
import styled from "styled-components";
import { Button } from 'react-bootstrap';


const NavegacaoHeader = (props) => {

    const HeaderStyle = styled.header`
        
        border: #51f651 solid 2px;
    `

    const NavBarStyle = styled.nav`
        background: #384f70;
        color:#fff; 
        padding:15px 20px;

        display: flex;
        justify-content: space-between;

        border: #f351f6 solid 2px;
    `

    const Logo = styled.img`
        width:20%;
        height:auto;

        border: #000000 solid 5px;
    `

    const Links = styled.a`
        color: white;

        border: #51f651 solid 2px;
    `

    const Botao = styled.button`
        background-color: #dfcd2d;
        width: 10%;

        `


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