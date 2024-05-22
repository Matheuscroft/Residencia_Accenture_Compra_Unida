import React, { useState, useEffect } from 'react';
import Mensagens from './Mensagens';
import Posts from './Posts';
import NavegacaoHome from './NavegacaoHome';
import NavegacaoHeader from './NavegacaoHeader';
import EditarProdutoModal from './EditarProdutoModal';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const HomeFornecedor = (props) => {
    const [exibeComponente, setExibeComponente] = useState("");
    const [listaProdutos, setListaProdutos] = useState([]);
    const [listaOfertas, setListaOfertas] = useState([]);
    const [selectedEntidade, setSelectedEntidade] = useState(null);
    const [showEditarModal, setShowEditarModal] = useState(false);

    const handleComponente = (comp) => {
        setExibeComponente(comp);
    };

    useEffect(() => {
        const produtosStorage = localStorage.getItem('produtos');
        if (produtosStorage) {
            const produtosConvertidos = JSON.parse(produtosStorage);
            setListaProdutos(listaAnterior => {
                const novosProdutos = produtosConvertidos.filter(novoProd =>
                    !listaAnterior.some(prod => prod.nomeProduto === novoProd.nomeProduto));
                return [...listaAnterior, ...novosProdutos];
            });
        }

        const ofertasStorage = localStorage.getItem('ofertas');
        if (ofertasStorage) {
            const ofertasConvertidas = JSON.parse(ofertasStorage);
            setListaOfertas(listaAnterior => {
                const novasOfertas = ofertasConvertidas.filter(novaOferta =>
                    !listaAnterior.some(oferta => oferta.nomeOferta === novaOferta.nomeOferta));
                return [...listaAnterior, ...novasOfertas];
            });
        }
    }, []);

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

    const listaProdutosLI = listaProdutos.map((produto) => (
        <li key={produto.id} style={{ display: "flex", alignItems: "center" }}>
        {produto.imagens && produto.imagens.length > 0 && (
            <img src={produto.imagens[0]} alt={produto.nomeProduto} style={{ width: "100px", height: "100px", marginRight: "10px" }} />
        )}
        {produto.nomeProduto}
        <Button variant="warning" size="sm" onClick={() => handleEditEntidade({ ...produto, tipo: "produto" })} className="ms-2">Editar</Button>
        <Button variant="danger" size="sm" onClick={() => excluirItem(produto.id, 'produto')} className="ms-2">X</Button>
    </li>
));

const listaOfertasLI = listaOfertas.map((oferta) => {
    const produtoRelacionado = listaProdutos.find(produto => produto.id === oferta.produtoRelacionado.id);
    return (
        <li key={oferta.id} style={{ display: "flex", alignItems: "center" }}>
            {produtoRelacionado && produtoRelacionado.imagens && produtoRelacionado.imagens.length > 0 && (
                <img src={produtoRelacionado.imagens[0]} alt={produtoRelacionado.nomeProduto} style={{ width: "100px", height: "100px", marginRight: "10px" }} />
            )}
            {oferta.nomeOferta}
            <Button variant="warning" size="sm" onClick={() => handleEditEntidade({ ...oferta, tipo: "oferta" })} className="ms-2">Editar</Button>
            <Button variant="danger" size="sm" onClick={() => excluirItem(oferta.id, 'oferta')} className="ms-2">X</Button>
        </li>
    );
});

switch (exibeComponente) {
    case "mensagens":
        return (
            <div>
                <NavegacaoHeader />
                <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage} />
                <Mensagens />
            </div>
        );

    case "posts":
        return (
            <div>
                <NavegacaoHeader />
                <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage} />
                <Posts />
            </div>
        );

    default:
        return (
            <div>
                <NavegacaoHeader />
                <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage} />
                <Container style={{ marginTop: '20px' }}>
                    <Row className="mb-4">
                        <Col className="d-flex justify-content-center">
                            <h1>HOME FORNECEDOR</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className="mb-4">
                                <Card.Body className="d-flex flex-column align-items-center"> 
                                    <Button className='botao-cadastrar mb-3 align-self-center' style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => props.handlePage("criar-produto")}>ADICIONAR PRODUTO</Button>
                                    <h5>Lista de Produtos</h5>
                                    <ul>
                                        {listaProdutosLI}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="mb-4">
                                <Card.Body className="d-flex flex-column align-items-center">
                                    <Button className='botao-cadastrar mb-3 align-self-center' style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => props.handlePage("criar-oferta")}>CRIAR OFERTA</Button>
                                    <h5>Lista de Ofertas</h5>
                                    <ul>
                                        {listaOfertasLI}
                                    </ul>
                                </Card.Body>
                            </Card>
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
        );
}
}

export default HomeFornecedor;