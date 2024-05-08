import React from "react";
import styled, { css } from 'styled-components'
import NavegacaoHeader from "./NavegacaoHeader";

const CadastroFornecedor = (props) => {

    const Button = styled.button`
        background: transparent;
        border-radius: 3px;
        border: 2px solid #BF4F74;
        color: #BF4F74;
        margin: 0.5em 1em;
        padding: 0.25em 1em;
        `

    const BotaoPrincipal = styled(Button)`
        color: tomato;
        border-color: tomato;
        `;

    const Paragrafo = styled.p`
        color: tomato;
        
        `;

    const Title = styled.h1`
        font-size: 1.5em;
        text-align: center;
        color: #BF4F74;
        `;

    const Input = styled.input`
        padding: 0.5em;
        margin: 0.5em;
        color: "#BF4F74";
        background: white;
        border: black 2px solid;
        border-radius: 3px;
        width: 100%;
        `;

    const Wrapper = styled.section`
        padding: 4em;
        background: papayawhip;
        `;


    const Container = styled.div`
        align-items: center;
        justify-content: center;
        display: flex;
        background-color: #a29f9f;
        flex-direction: column;

        `


    const fornecedor = {
        nome: "",
        cnpj: "",
        endereco: "",
        telefone: "",
        email: "",
        senha: "",
        MEI: ""
    }

    return (
        
        <div>
            <NavegacaoHeader/>
            
            <Wrapper>
                <Title>Cadastro - Fornecedor</Title>
                <Paragrafo>Razão Social:</Paragrafo>
                <Input type="text" placeholder="Nome Completo" /><br />
                <Paragrafo>Nome Completo do Responsável:</Paragrafo>
                <Input type="text" placeholder="Nome Completo" /><br />
                <Paragrafo>CPNJ/MEI: OBRIGATORIO</Paragrafo>
                <Input type="text" placeholder="CPF/CPNJ" /><br />
                <Paragrafo>Endereço: OBG</Paragrafo>
                <Input type="text" placeholder="Endereço" /><br />
                <Paragrafo>Telefone: OBG</Paragrafo>
                <Input type="text" placeholder="Telefone" /><br />
                <Paragrafo>E-mail: OBG</Paragrafo>
                <Input type="email" placeholder="E-mail" /><br />
                <Paragrafo>Senha: OBG</Paragrafo>
                <Input type="password" placeholder="Senha" /><br />
                <Paragrafo>Confirma Senha: OBG</Paragrafo>
                <Input type="password" placeholder="Senha" /><br />
                <Button>Cadastrar</Button>
                <BotaoPrincipal>MEU NOME</BotaoPrincipal>
            </Wrapper>
        </div>
    )
}

export default CadastroFornecedor