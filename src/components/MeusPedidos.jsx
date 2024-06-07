import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getPedidos } from '../auth/firebaseService';
import { ordenarPorDataString } from './Utils';

const MeusPedidos = (props) => {
    const [listaPedidos, setListaPedidos] = useState([]);
    const userId = props.userId;



    useEffect(() => {
        console.log("userId do meus pedidos")
        console.log(userId)
        const fetchPedidos = async () => {
            const pedidos = await getPedidos(userId);

            const pedidosOrdenados = ordenarPorDataString(pedidos, 'dataDePedido');
            setListaPedidos(pedidosOrdenados);



        };

        fetchPedidos();
    }, []);

    const handleProdutoClick = (produto) => {
        props.handlePage("oferta", { userId: userId, oferta: produto});
    };

    const definirCorSituacao = (status) => {
        switch (status) {
            case 'Pendente':
                return 'warning';
            case 'Concluído':
                return 'success';
            case 'Cancelado':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const listaPedidosLI = listaPedidos.map((pedido) => (
        <Card key={pedido.id} className="mb-4">
            <Card.Header>
                <div>
                    <h4>Pedido: {pedido.id}</h4>
                    <p>Data do Pedido: {pedido.dataDePedido}</p>
                    <p>Valor do Pedido: R$ {pedido.valorPedido}</p>
                </div>
            </Card.Header>
            <Card.Body>
                {pedido.ofertasRelacionadas.map((oferta, index) => (
                    <Row key={index} className="mb-3 align-items-center" onClick={() => handleProdutoClick(oferta.produtoRelacionado)} style={{ cursor: 'pointer' }}>
                        <Col xs={2}>
                            {oferta.produtoRelacionado.imagens && oferta.produtoRelacionado.imagens.length > 0 && (
                                <img src={oferta.produtoRelacionado.imagens[0]} alt={oferta.produtoRelacionado.nomeProduto} style={{ width: '100%' }} />
                            )}
                        </Col>
                        <Col xs={2}>
                            <h5>{oferta.produtoRelacionado.nomeProduto}</h5>
                            <p>{oferta.descricao}</p>
                        </Col>
                        <Col xs={2}>
                            <p>{oferta.precoEspecial}</p>
                        </Col>
                        <Col xs={2}>
                            <p>Qtd: {oferta.quantidadeVendas}</p>
                        </Col>
                        <Col xs={2}>
                            <Card bg={definirCorSituacao(oferta.status)} text="white" className="text-center">
                                <Card.Body>
                                    <Card.Text>
                                        Situação: {oferta.status}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                ))}
            </Card.Body>
        </Card>
    ));

    return (
        <Container>
            <h1 className="text-center">Meus Pedidos</h1>
            <Row>
                <Col xs={12} md={8}>
                    {listaPedidosLI}
                </Col>
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body>
                            <h5>Resumo</h5>
                            <p>Total de Pedidos: {listaPedidos.length}</p>
                            <Button variant="warning" onClick={() => props.handlePage("home-cliente", { userId: userId })} className="w-100">Continuar Comprando</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MeusPedidos;
