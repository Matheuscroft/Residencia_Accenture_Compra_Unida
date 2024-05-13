import React, { useState } from "react";
import NavegacaoHeader from "./NavegacaoHeader";
import { Input, Wrapper, Title, Button, BotaoPrincipal } from "./Estilos";
import { v4 as uuidv4 } from 'uuid';

const CriarOferta = (props) => {

    const [oferta, setOferta] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        //setProduto(values => ({...values, [name]: value}))
        setOferta({ ...oferta, [name]: value })
        console.log(oferta)
    }

    const handleSubmit = (event) => {

        event.preventDefault();
        const produtoComId = {
            id: uuidv4(),
            ...oferta
        };

        const produtosAtuais = JSON.parse(localStorage.getItem('produtos')) || [];

        const novosProdutos = [...produtosAtuais, produtoComId];

        localStorage.setItem('produtos', JSON.stringify(novosProdutos));

        alert(`${produtoComId.nomeProduto} cadastrado com sucesso`);

        console.log("olha abaixo o que tem no getItem:");
        console.log(localStorage.getItem('produtos'));

        props.handlePage("home-fornecedor");

    }

    return (

        <div>
            <NavegacaoHeader />

            <Wrapper>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                    <Title>Cadastrar nova oferta</Title>

                    <label htmlFor="nomeOferta">Nome da oferta</label>
                    <Input type="text" id="nomeOferta" name="nomeOferta" value={oferta.nomeOferta || ""} onChange={handleChange} placeholder="Nome da oferta" required />

                    <label htmlFor="descricao">Descrição</label>
                    <Input type="text" id="descricao" name="descricao" value={oferta.descricao || ""} onChange={handleChange} placeholder="Descrição da oferta" required />

                    <label htmlFor="produtoRelacionado">Produto relacionado</label>
                    <Input type="text" id="produtoRelacionado" name="produtoRelacionado" value={oferta.produtoRelacionado || ""} onChange={handleChange} placeholder="Produto relacionado à oferta" required />

                    <label htmlFor="precoEspecial">Preço especial</label>
                    <Input type="number" id="precoEspecial" name="precoEspecial" value={oferta.precoEspecial || ""} onChange={handleChange} placeholder="Preço especial da oferta" required />

                    <label htmlFor="quantidadeMinima">Quantidade mínima para ativação da oferta</label>
                    <Input type="text" id="quantidadeMinima" name="quantidadeMinima" value={oferta.quantidadeMinima || ""} onChange={handleChange} placeholder="Quantidade miníma para a oferta" required />

                    <label htmlFor="dataInicio">Data de início da oferta</label>
                    <Input type="text" id="dataInicio" name="dataInicio" value={oferta.dataInicio || ""} onChange={handleChange} placeholder="Data de início da oferta" required />

                    <label htmlFor="dataTermino">Data de término da oferta</label>
                    <Input type="text" id="dataTermino" name="dataTermino" value={oferta.dataTermino || ""} onChange={handleChange} placeholder="Data de término da oferta" required />

                    <input type="submit" />
                    <Button>Cadastrar</Button>
                    <BotaoPrincipal>MEU NOME</BotaoPrincipal>
                </form>
            </Wrapper>
        </div>
    )
}

export default CriarOferta