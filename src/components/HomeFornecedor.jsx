import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import NavegacaoHeader from './NavegacaoHeader';
import NavegacaoHome from './NavegacaoHome';
import { getProdutos, getOfertas, deleteProduto, deleteOferta, deleteImage } from "../auth/firebaseService";

const HomeFornecedor = (props) => {
    const [listaProdutos, setListaProdutos] = useState([]);
    const [listaOfertas, setListaOfertas] = useState([]);
    const [imageUrl, setImageUrl] = useState(''); // Novo estado para URL da imagem

    useEffect(() => {
        const fetchProdutos = async () => {
            const produtos = await getProdutos();
            setListaProdutos(produtos);
        };

        const fetchOfertas = async () => {
            const ofertas = await getOfertas();
            setListaOfertas(ofertas);
        };

        fetchProdutos();
        fetchOfertas();
    }, []);

    const excluirItem = async (elementoID, tipo) => {
        if (tipo === 'produto') {
            const produto = listaProdutos.find(elemento => elemento.id === elementoID);
            if (produto && Array.isArray(produto.imagens)) {
                await Promise.all(produto.imagens.map(imageUrl => deleteImage(imageUrl)));
            }
            await deleteProduto(elementoID);
            const novaListaProdutos = listaProdutos.filter(elemento => elemento.id !== elementoID);
            setListaProdutos(novaListaProdutos);
            localStorage.setItem('produtos', JSON.stringify(novaListaProdutos));
        } else if (tipo === 'oferta') {
            await deleteOferta(elementoID);
            const novaListaOfertas = listaOfertas.filter(elemento => elemento.id !== elementoID);
            setListaOfertas(novaListaOfertas);
            localStorage.setItem('ofertas', JSON.stringify(novaListaOfertas));
        }
    };

    const handleEditEntidade = (entidade) => {
        // Lógica para editar entidade
    };

    const listaprodutosLI = listaProdutos.map((produto) => (
        <li key={produto.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "100%" }}>
            {produto.imagens && produto.imagens.length > 0 && (
                <img src={produto.imagens[0]} alt={produto.nomeProduto} style={{ width: "100px", height: "100px", marginRight: "10px" }} />
            )}
            <div style={{ flex: 1 }}>
                {produto.nomeProduto}
            </div>
            <Button variant="warning" size="sm" onClick={() => handleEditEntidade({ ...produto, tipo: "produto" })} className="ms-2">Editar</Button>
            <Button variant="danger" size="sm" onClick={() => excluirItem(produto.id, 'produto')} className="ms-2">X</Button>
        </li>
    ));

    const listaOfertasLI = listaOfertas.map((oferta) => {
        const produtoRelacionado = listaProdutos.find(produto => produto.id === (oferta.produtoRelacionado && oferta.produtoRelacionado.id));
        return (
            <li key={oferta.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "100%" }}>
                {produtoRelacionado && produtoRelacionado.imagens && produtoRelacionado.imagens.length > 0 && (
                    <img src={produtoRelacionado.imagens[0]} alt={produtoRelacionado.nomeProduto} style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                )}
                <div style={{ flex: 1 }}>
                    {oferta.nomeOferta}
                </div>
                <Button variant="warning" size="sm" onClick={() => handleEditEntidade({ ...oferta, tipo: "oferta" })} className="ms-2">Editar</Button>
                <Button variant="danger" size="sm" onClick={() => excluirItem(oferta.id, 'oferta')} className="ms-2">X</Button>
            </li>
        );
    });

    return (
        <div>
            <NavegacaoHeader />
            <NavegacaoHome handleComponente={() => {}} handlePage={props.handlePage} />
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
                                <Button className='botao-cadastrar mb-3 align-self-center' style={{ backgroundColor: '#FFCD00', borderColor: '#FFCD00' }} onClick={() => props.handlePage('cadastroProduto')}>Cadastrar Produto</Button>
                                <ul style={{ width: "100%" }}>
                                    {listaprodutosLI}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className="mb-4">
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Button className='botao-cadastrar mb-3 align-self-center' style={{ backgroundColor: '#FFCD00', borderColor: '#FFCD00' }} onClick={() => props.handlePage('cadastroOferta')}>Cadastrar Oferta</Button>
                                <ul style={{ width: "100%" }}>
                                    {listaOfertasLI}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HomeFornecedor;