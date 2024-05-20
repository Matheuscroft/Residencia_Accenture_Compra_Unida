import React, { useState, useEffect } from 'react';
import Mensagens from './Mensagens'
import Posts from './Posts'
import NavegacaoHome from './NavegacaoHome';
import NavegacaoHeader from './NavegacaoHeader';
import EditarProdutoModal from './EditarProdutoModal';

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

    const [selectedEntidade, setSelectedEntidade] = useState(null);
    const [showEditarModal, setShowEditarModal] = useState(false);

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

    const excluirItem = (elementoID, tipo) => {
        if (tipo === 'produto') {
            const novaListaProdutos = listaProdutos.filter(elemento => elemento.id !== elementoID);
            setListaProdutos(novaListaProdutos);
            localStorage.setItem('produtos', JSON.stringify(novaListaProdutos));
        } else if (tipo === 'oferta') {
            const novaListaOfertas = listaOfertas.filter(elemento => elemento.id !== elementoID);
            setListaOfertas(novaListaOfertas);
            localStorage.setItem('ofertas', JSON.stringify(novaListaOfertas));
        }
    };

    const handleEditEntidade = (entidade) => {
        setSelectedEntidade(entidade);
        setShowEditarModal(true);
    };

    const handleSaveEditProduto = (editedEntidade) => {
        if (editedEntidade.tipo === "produto") {
            const novaListaProdutos = listaProdutos.map(produto =>
                produto.id === editedEntidade.id ? editedEntidade : produto
            );
            setListaProdutos(novaListaProdutos);
            localStorage.setItem('produtos', JSON.stringify(novaListaProdutos));
        } else if (editedEntidade.tipo === "oferta") {
            const novaListaOfertas = listaOfertas.map(oferta =>
                oferta.id === editedEntidade.id ? editedEntidade : oferta
            );
            setListaOfertas(novaListaOfertas);
            localStorage.setItem('ofertas', JSON.stringify(novaListaOfertas));
        }
        setShowEditarModal(false);
    };

    const listaProdutosLI = listaProdutos.map((produto, index) => {

        return (
            <li key={produto.id} style={{ display: "flex", alignItems: "center" }}>
                {produto.imagens && produto.imagens.length > 0 && (
                    <img src={produto.imagens[0]} alt={produto.nomeProduto} style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                )}
                {produto.nomeProduto}
                <button onClick={() => handleEditEntidade({ ...produto, tipo: "produto" })}>Editar</button>
                <button onClick={() => excluirItem(produto.id, 'produto')}>X</button>
            </li>
        )
    })

    const listaOfertasLI = listaOfertas.map((oferta, index) => {
        
        const produtoRelacionado = listaProdutos.find(produto => produto.id === oferta.produtoRelacionado.id);

        return (
            <li key={oferta.id} style={{ display: "flex", alignItems: "center" }}>
                {produtoRelacionado && produtoRelacionado.imagens && produtoRelacionado.imagens.length > 0 && (
                    <img src={produtoRelacionado.imagens[0]} alt={produtoRelacionado.nomeProduto} style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                )}
                {oferta.nomeOferta}
                <button onClick={() => handleEditEntidade({ ...oferta, tipo: "oferta" })}>Editar</button>
                <button onClick={() => excluirItem(oferta.id, 'oferta')}>X</button>
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
                                    <button className='botao-cadastrar' onClick={() => props.handlePage("criar-oferta")}>CRIAR OFERTA</button>
                                    <br />
                                    <p>Lista de Ofertas</p>
                                    <ul>
                                        {listaOfertasLI}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <EditarProdutoModal
                        show={showEditarModal}
                        onHide={() => setShowEditarModal(false)}
                        entidade={selectedEntidade}
                        onEdit={handleSaveEditProduto}
                    />
                </div>
            )

            break;
    }

}

export default HomeFornecedor