import React, { useState, useEffect } from 'react';
import EditarProdutoModal from './EditarProdutoModal';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { getProdutos, getOfertas, deletarProduto, deletarOferta, deletarImagem, editarProduto, editarOferta } from "../auth/firebaseService";

const HomeFornecedor = (props) => {

    const [listaProdutos, setListaProdutos] = useState([]);
    const [listaOfertas, setListaOfertas] = useState([]);
    const [selectedEntidade, setSelectedEntidade] = useState(null);
    const [showEditarModal, setShowEditarModal] = useState(false);

    useEffect(() => {

        const fetchProdutos = async () => {
            const produtos = await getProdutos();
            console.log("olha os produtos do getprodutos:")
            console.log(produtos)
            setListaProdutos(produtos);
        };


        const fetchOfertas = async () => {
            const ofertas = await getOfertas();
            console.log("olha as ofertas  do getofertas:")
            console.log(ofertas)
            setListaOfertas(ofertas);
        };

        fetchProdutos();
        fetchOfertas();
       
    }, []);

    const excluirItem = async (elementoID, tipo) => {

        if (tipo === 'produto') {

            const produto = listaProdutos.find(elemento => elemento.id === elementoID);
            if (produto && Array.isArray(produto.imagens)) {
                //await Promise.all(produto.imagens.map(imagemUrl => deletarImagem(imagemUrl)));
            }
            await deletarProduto(elementoID);
            const novaListaProdutos = listaProdutos.filter(elemento => elemento.id !== elementoID);
            setListaProdutos(novaListaProdutos);

        } else if (tipo === 'oferta') {

            await deletarOferta(elementoID);
            const novaListaOfertas = listaOfertas.filter(elemento => elemento.id !== elementoID);
            setListaOfertas(novaListaOfertas);
        }
    };

    const handleEditEntidade = (entidade) => {
        setSelectedEntidade(entidade);
        setShowEditarModal(true);
    };

    const handleSalvarProdutoEditado = (entidadeEditada) => {
        if (entidadeEditada.tipo === "produto") {

            editarProduto(entidadeEditada.id, entidadeEditada);

            const novaListaProdutos = listaProdutos.map(produto =>
                produto.id === entidadeEditada.id ? entidadeEditada : produto
            );
            
            console.log(entidadeEditada.imagens)
            setListaProdutos(novaListaProdutos);

        } else if (entidadeEditada.tipo === "oferta") {

            editarOferta(entidadeEditada.id, entidadeEditada);

            const novaListaOfertas = listaOfertas.map(oferta =>
                oferta.id === entidadeEditada.id ? entidadeEditada : oferta
            );
            
            setListaOfertas(novaListaOfertas);
        }
        setShowEditarModal(false);
    };

    const listaProdutosLI = listaProdutos.map((produto) => (
        <li key={produto.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
    
        return (
            <div>
                <Container style={{ marginTop: '20px' }}>
                    <Row className="mb-4">
                        <Col className="d-flex justify-content-center">
                        <Button
                                    variant="warning"
                                    onClick={() => props.handlePage("gerenciar-pedidos")}
                                    style={{ marginTop: '20px', width: '100%' }}
                                >
                                    Ver Pedidos
                                </Button>
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
                    onEdit={handleSalvarProdutoEditado}
                />
            </div>
        );
    }
    
    export default HomeFornecedor;