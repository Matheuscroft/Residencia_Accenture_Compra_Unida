import React, { useState, useEffect } from 'react';
import Mensagens from './Mensagens'
import Posts from './Posts'
import NavegacaoHome from './HomeCliente';
import NavegacaoHeader from './NavegacaoHeader';
import EditarProdutoModal from './EditarProdutoModal';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const HomeCliente = (props) => {

    const [exibeComponente, setExibeComponente] = useState("")

    const handleComponente = (comp) => {
        setExibeComponente(comp)
    }



    const [listaProdutos, setListaProdutos] = useState([])
    const [listaOfertas, setListaOfertas] = useState([])

    useEffect(() => {

        const produtosStorage = localStorage.getItem('produtos');

        if (produtosStorage) {
            const produtosConvertidos = JSON.parse(produtosStorage);
            console.log("Produtos convertidos de volta:", produtosConvertidos);


            setListaProdutos(listaAnterior => {
                const novosProdutos = produtosConvertidos.filter(novoProd =>
                    !listaAnterior.some(prod => prod.nomeProduto === novoProd.nomeProduto));
                console.log("Novos produtos adicionados:", novosProdutos);
                return [...listaAnterior, ...novosProdutos];
            });
        }

        const ofertasStorage = localStorage.getItem('ofertas');

        if (ofertasStorage) {
            const ofertasConvertidas = JSON.parse(ofertasStorage);
            console.log("Ofertas convertidas de volta:", ofertasConvertidas);


            setListaOfertas(listaAnterior => {
                const novasOfertas = ofertasConvertidas.filter(novaOferta =>
                    !listaAnterior.some(oferta => oferta.nomeOferta === novaOferta.nomeOferta));
                console.log("Novas ofertas adicionadas:", novasOfertas);
                return [...listaAnterior, ...novasOfertas];
            });
        }

        console.log("ATUALIZOU");

    }, []);

    useEffect(() => {
        console.log("Conteúdo atual da lista:", listaProdutos);
    }, [listaProdutos]);


    const listaOfertasLI = listaOfertas.map((oferta, index) => {
        
        const produtoRelacionado = listaProdutos.find(produto => produto.id === oferta.produtoRelacionado.id);

        return (
            <li key={oferta.id} style={{ display: "flex", alignItems: "center" }}>
                {produtoRelacionado && produtoRelacionado.imagens && produtoRelacionado.imagens.length > 0 && (
                    <img src={produtoRelacionado.imagens[0]} alt={produtoRelacionado.nomeProduto} style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                )}
                {oferta.nomeOferta}
               
            </li>
        );
    })



    switch (exibeComponente) {
        case "mensagens":

            return (
                <div>
                    <NavegacaoHeader />
                    <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage} />
                    <Mensagens />
                </div>
            )

        case "posts":

            return (
                <div>
                    <NavegacaoHeader />
                    <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage} />
                    <Posts />
                </div>
            )

        default:

            return (
                <div>
                    <NavegacaoHeader />
                    <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage} />



                    <Container>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <h1>HOME FORNECEDOR</h1>
                            </Col>

                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-center" style={{ border: "solid green 2px" }}>
                               
                            </Col>
                            <Col className="d-flex justify-content-center" style={{ border: "solid green 2px" }}>
                                <div style={{ border: "solid blue 2px" }}>
                                    
                                    <p>Lista de Ofertas</p>
                                    <ul>
                                        {listaOfertasLI}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                   
                </div>
            )
    }

}

export default HomeCliente