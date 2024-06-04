import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getPedidos } from '../auth/firebaseService';

const GerenciarPedidos = (props) => {
    const [listaPedidos, setListaPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            const pedidos = await getPedidos();
            const userId = props.userId;

            console.log("to no fetch do ger pedidos")

            console.log("pedidos")
            console.log(pedidos)

            const pedidosFiltrados = pedidos.filter(pedido => {

                // Verifica se alguma oferta dentro de ofertasRelacionadas tem o userId correspondente
                const ofertasFiltradas = pedido.ofertasRelacionadas.filter(oferta => oferta.userId === userId);

                // Se nenhuma oferta dentro de ofertasRelacionadas tem o userId correspondente, retorna false
                if (ofertasFiltradas.length === 0) return false;

                // Atualiza ofertasRelacionadas com as ofertas filtradas
                pedido.ofertasRelacionadas = ofertasFiltradas;
                return true;
            });

            console.log("pedidosFiltrados")
            console.log(pedidosFiltrados)

            const pedidosComData = pedidosFiltrados.map(pedido => {
                if (pedido.dataDePedido && pedido.dataDePedido.seconds) {
                    pedido.dataDePedido = new Date(pedido.dataDePedido.seconds * 1000);
                } else {
                    pedido.dataDePedido = new Date(pedido.dataDePedido);
                }
                return pedido;
            });

            const pedidosOrdenados = pedidosComData.sort((a, b) => b.dataDePedido - a.dataDePedido);
            setListaPedidos(pedidosOrdenados);
        };

        fetchPedidos();
    }, [/*props.userId*/]);


    const handleProdutoClick = (produto) => {
        props.handlePage("produto", produto);
    };

    const listaPedidosLI = listaPedidos.map((pedido) => (
        <Card key={pedido.id} className="mb-4">
            <Card.Header>
                <div>
                    <h4>Pedido: {pedido.id}</h4>
                    <p>Data do Pedido: {pedido.dataDePedido.toLocaleDateString('pt-BR')}</p>
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
                        <Col xs={4}>
                            <h5>{oferta.produtoRelacionado.nomeProduto}</h5>
                            <p>{oferta.descricao}</p>
                        </Col>
                        <Col xs={1}>
                            <p>{oferta.precoEspecial}</p>
                        </Col>
                        <Col xs={1}>
                            <p>Qtd: {oferta.quantidadeVendas}</p>
                        </Col>
                        <Col xs={2}>
                            <p>Situação: {oferta.status}</p>
                        </Col>
                    </Row>
                ))}
            </Card.Body>
        </Card>
    ));

    return (
        <Container>
            <Row>
                <Col xs={12} md={2}>
                    <Button variant="warning" onClick={() => props.handlePage("home-fornecedor", { userId: props.userId })} className="w-100">Voltar</Button>
                </Col>
                <Col xs={12} md={10}>
                    <h1 className="text-center">Gerenciar Pedidos</h1>
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={8}>
                    {listaPedidosLI}
                </Col>
                <Col xs={12} md={4}>

                </Col>
            </Row>
        </Container>
    );
};

export default GerenciarPedidos;
