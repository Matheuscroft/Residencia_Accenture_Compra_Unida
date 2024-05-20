import React, { useState, useEffect } from "react";
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

    const handlePriceChange = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = "R$ " + value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        setProduto({ ...produto, preco: value });
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        const imagesArray = Array.from(files).map(file => URL.createObjectURL(file));
        setProduto({ ...produto, imagens: imagesArray });
    };


    const handleSubmit = (event) => {

        event.preventDefault();

        if (produto.categoria === "default") {
            alert("Selecione um produto")
            return;
        }



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
                    <select name="categoria" id="categoria" onChange={handleChange}>
                        <option value="default">Selecione uma categoria</option>
                        <option value="alimentacao">Alimentação</option>
                        <option value="vestuario">Vestuário</option>
                        <option value="racao">Ração</option>
                        <option value="bebidas">Bebidas</option>
                    </select>


                    <label htmlFor="preco">Preço</label>
                    <Input type="text" id="preco" name="preco" value={produto.preco || ""} onChange={handlePriceChange} placeholder="Preço do produto" required />

                    <label htmlFor="quantidadeEstoque">Quantidade em estoque</label>
                    <Input type="number" id="quantidadeEstoque" name="quantidadeEstoque" value={produto.quantidadeEstoque || ""} onChange={handleChange} placeholder="Quantidade em estoque do produto" required />

                    <label htmlFor="imagens">Imagens</label>
                    <Input type="text" id="imagens" name="imagens" value={produto.imagens || ""} onChange={handleChange} placeholder="Imagens do produto" required />
                    <Input type="file" id="imagens" name="imagens" onChange={handleImageChange} multiple />

                    <input type="submit" />
                    <Button>Cadastrar</Button>
                    <BotaoPrincipal>MEU NOME</BotaoPrincipal>
                </form>
            </Wrapper>
        </div>
    )
}

export default CriarProduto