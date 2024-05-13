import React, { useState } from "react";
import NavegacaoHeader from "./NavegacaoHeader";
import { Input, Wrapper, Title, Button, BotaoPrincipal } from "./Estilos";
import { v4 as uuidv4 } from 'uuid';

const CriarProduto = (props) => {

    const [produto, setProduto] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        //setProduto(values => ({...values, [name]: value}))
        setProduto({ ...produto, [name]: value })
        console.log(produto)
    }

    const handleSubmit = (event) => {

        event.preventDefault();
        const produtoComId = {
            id: uuidv4(),
            ...produto
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
                    <Title>Cadastrar novo produto</Title>

                    <label htmlFor="nomeProduto">Nome do produto</label>
                    <Input type="text" id="nomeProduto" name="nomeProduto" value={produto.nomeProduto || ""} onChange={handleChange} placeholder="Nome do produto" required />

                    <label htmlFor="descricao">Descrição</label>
                    <Input type="text" id="descricao" name="descricao" value={produto.descricao || ""} onChange={handleChange} placeholder="Descrição do produto" required />

                    <label htmlFor="categoria">Categoria</label>
                    <Input type="text" id="categoria" name="categoria" value={produto.categoria || ""} onChange={handleChange} placeholder="Categoria do produto" required />

                    <label htmlFor="preco">Preço</label>
                    <Input type="number" id="preco" name="preco" value={produto.preco || ""} onChange={handleChange} placeholder="Preço do produto" required />

                    <label htmlFor="quantidadeEstoque">Quantidade em estoque</label>
                    <Input type="text" id="quantidadeEstoque" name="quantidadeEstoque" value={produto.quantidadeEstoque || ""} onChange={handleChange} placeholder="Quantidade em estoque do produto" required />

                    <label htmlFor="imagens">Imagens</label>
                    <Input type="text" id="imagens" name="imagens" value={produto.imagens || ""} onChange={handleChange} placeholder="Imagens do produto" required />

                    <input type="submit" />
                    <Button>Cadastrar</Button>
                    <BotaoPrincipal>MEU NOME</BotaoPrincipal>
                </form>
            </Wrapper>
        </div>
    )
}

export default CriarProduto