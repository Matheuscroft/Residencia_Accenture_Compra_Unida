import React, { useState, useEffect } from "react";
import NavegacaoHeader from "./NavegacaoHeader";
import { Input, Wrapper, Title, Button, BotaoPrincipal } from "./Estilos";
import { v4 as uuidv4 } from 'uuid';

const CriarOferta = (props) => {

    const [oferta, setOferta] = useState({});
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {

        const produtosStorage = localStorage.getItem('produtos');

        if (produtosStorage) {
            const produtosConvertidos = JSON.parse(produtosStorage);
            console.log("Produtos convertidos de volta:", produtosConvertidos);


            setProdutos(listaAnterior => {
                const novosProdutos = produtosConvertidos.filter(novoProd =>
                    !listaAnterior.some(prod => prod.nomeProduto === novoProd.nomeProduto));
                console.log("Novos produtos adicionados:", novosProdutos);
                return [...listaAnterior, ...novosProdutos];
            });
        }        
    }, [])

    const produtosSelect = produtos.map((produto, index) => {
        return (
            <option value={produto.id} key={index}>{produto.nomeProduto}</option>
        )
    })

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === "dataInicio" && oferta.dataTermino && value > oferta.dataTermino) {
            setOferta({ ...oferta, [name]: value, dataTermino: "" });
        } else {
            setOferta({ ...oferta, [name]: value });
        }

        setOferta({ ...oferta, [name]: value })
        console.log(oferta)
    }

    const handlePriceChange = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = "R$ " + value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        setOferta({ ...oferta, precoEspecial: value });
    };

    const handleSubmit = (event) => {

        event.preventDefault();

        if(oferta.produtoRelacionado === "default")
        {
            alert("Selecione um produto")
            return
        }

        if (oferta.dataTermino && oferta.dataInicio && oferta.dataTermino < oferta.dataInicio) {
            alert("A data de término não pode ser inferior à data de início.");
            return;
        }

        const produtoSelecionado = produtos.find(produto => produto.id === oferta.produtoRelacionado);

        if (!produtoSelecionado) {
            alert("Produto não encontrado");
            return;
        }

        const ofertaComId = {
            id: uuidv4(),
            ...oferta,
            produtoRelacionado: produtoSelecionado
        };

        const ofertasAtuais = JSON.parse(localStorage.getItem('ofertas')) || [];

        const novasOfertas = [...ofertasAtuais, ofertaComId];

        localStorage.setItem('ofertas', JSON.stringify(novasOfertas));

        alert(`${ofertaComId.nomeOferta} cadastrado com sucesso`);

        console.log("olha abaixo o que tem no getItem:");
        console.log(localStorage.getItem('ofertas'));

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
                    <select name="produtoRelacionado" id="produtoRelacionado" onChange={handleChange}>
                        <option value="default">Selecione um produto</option>
                        {produtosSelect}
                    </select>

                    <label htmlFor="precoEspecial">Preço especial</label>
                    <Input type="text" id="precoEspecial" name="precoEspecial" value={oferta.precoEspecial || ""} onChange={handlePriceChange} placeholder="Preço especial da oferta" required />

                    <label htmlFor="quantidadeMinima">Quantidade mínima para ativação da oferta</label>
                    <Input type="number" id="quantidadeMinima" name="quantidadeMinima" value={oferta.quantidadeMinima || ""} onChange={handleChange} placeholder="Quantidade miníma para a oferta" required />

                    <label htmlFor="dataInicio">Data de início da oferta</label>
                    <Input type="date" id="dataInicio" name="dataInicio" value={oferta.dataInicio || ""} onChange={handleChange} placeholder="Data de início da oferta" required />

                    <label htmlFor="dataTermino">Data de término da oferta</label>
                    <Input type="date" id="dataTermino" name="dataTermino" value={oferta.dataTermino || ""} onChange={handleChange} placeholder="Data de término da oferta" required disabled={!oferta.dataInicio}/>

                    <input type="submit" />
                    <Button>Cadastrar</Button>
                    <BotaoPrincipal>MEU NOME</BotaoPrincipal>
                </form>
            </Wrapper>
        </div>
    )
}

export default CriarOferta