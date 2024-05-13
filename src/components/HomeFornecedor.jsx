import React, { useState, useEffect } from 'react';
import Mensagens from './Mensagens'
import Posts from './Posts'
import NavegacaoHome from './NavegacaoHome';
import NavegacaoHeader from './NavegacaoHeader';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const HomeFornecedor = (props) => {

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
    }, []); 

    useEffect(() => {
        console.log("Conteúdo atual da lista:", listaProdutos);
    }, [listaProdutos]); 

    const excluirItem = (elementoID) => {
        
        const novaLista = listaProdutos.filter(elemento => elemento.id !== elementoID);
        setListaProdutos(novaLista);
        localStorage.setItem('produtos', JSON.stringify(novaLista));
    }

    const listaProdutosLI = listaProdutos.map((elemento, index) => {

        return (
            <li key={elemento.id}>{elemento.nomeProduto} <button onClick={() => excluirItem(elemento.id)}>X</button></li>
        )
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
                                <div style={{ border: "solid green 2px" }}>
                                    <button className='botao-cadastrar' onClick={() => props.handlePage("criar-produto")}>CADASTRAR PRODUTO</button>
                                    <br />
                                    <p style={{ border: "solid yellow 2px" }}>Lista de Produtos</p>
                                    <ul>
                                        {listaProdutosLI}
                                    </ul>
                                </div>
                            </Col>
                            <Col className="d-flex justify-content-center" style={{ border: "solid green 2px" }}>
                                <div style={{ border: "solid blue 2px" }}>
                                    <button className='botao-cadastrar'onClick={() => props.handlePage("criar-oferta")}>CRIAR OFERTA</button>
                                    <br />
                                    <p>Lista de Ofertas</p>
                                    <ul>
                                        <li>Oferta 1</li>
                                        <li>Oferta 2</li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                </div>
            )

            break;
    }

}

export default HomeFornecedor