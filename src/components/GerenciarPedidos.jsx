import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { getPedidos, editarPedido, editarOferta } from '../auth/firebaseService';
import { ordenarPorDataString } from './Utils'

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



            const pedidosOrdenados = ordenarPorDataString(pedidosFiltrados, 'dataDePedido');
            setListaPedidos(pedidosOrdenados);
        };

        fetchPedidos();
    }, [props.userId]);


    const handleProdutoClick = (produto) => {
        props.handlePage("produto", produto);
    };

    const definirCorSituacao = (status) => {
        switch (status) {
            case 'pendente':
                return 'warning';
            case 'Concluído':
                return 'success';
            case 'Cancelado':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    
const atualizarStatusOferta = async (pedidoId, ofertaId, novoStatus) => {
    
    await editarOferta(ofertaId, { status: novoStatus });

    const novaListaPedidos = listaPedidos.map(pedido => {
        if (pedido.id === pedidoId) {
            return {
                ...pedido,
                ofertasRelacionadas: pedido.ofertasRelacionadas.map(oferta => {
                    if (oferta.id === ofertaId) {
                        return { ...oferta, status: novoStatus };
                    }
                    return oferta;
                })
            };
        }
        
        return pedido;
    });

    const pedidoAtualizado = novaListaPedidos.find(pedido => pedido.id === pedidoId);
    console.log("pedidoAtualizado")
    console.log(pedidoAtualizado)

    await editarPedido(pedidoId, pedidoAtualizado);


    // Atualizando o estado local
    setListaPedidos(novaListaPedidos);
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
                    <Row key={index} className="mb-3 align-items-center" style={{ cursor: 'pointer' }}>
                        <Col xs={2} onClick={() => handleProdutoClick(oferta.produtoRelacionado)}>
                            {oferta.produtoRelacionado.imagens && oferta.produtoRelacionado.imagens.length > 0 && (
                                <img src={oferta.produtoRelacionado.imagens[0]} alt={oferta.produtoRelacionado.nomeProduto} style={{ width: '100%' }} />
                            )}
                        </Col>
                        <Col xs={2} onClick={() => handleProdutoClick(oferta.produtoRelacionado)}>
                            <h5>{oferta.produtoRelacionado.nomeProduto}</h5>
                            <p>{oferta.descricao}</p>
                        </Col>
                        <Col xs={2} onClick={() => handleProdutoClick(oferta.produtoRelacionado)}>
                            <p>{oferta.precoEspecial}</p>
                        </Col>
                        <Col xs={2} onClick={() => handleProdutoClick(oferta.produtoRelacionado)}>
                            <p>Qtd: {oferta.quantidadeVendas}</p>
                        </Col>
                        <Col xs={2}>
                        <Card bg={definirCorSituacao(oferta.status)} class="card" style={{ width: '150px' }} text="white" className="text-center">
                                <Card.Body>
                                    <Card.Text>
                                        Situação: {oferta.status}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={2}>
                            {!oferta.finalizado && (
                                <ButtonGroup vertical>
                                    <Button
                                        variant="success"
                                        className="mb-2"
                                        onClick={() => atualizarStatusOferta(pedido.id, oferta.id, 'Concluído')}
                                    >
                                        Finalizar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => atualizarStatusOferta(pedido.id, oferta.id, 'Cancelado')}
                                    >
                                        Cancelar
                                    </Button>
                                </ButtonGroup>
                            )}
                        </Col>


                    </Row>
                ))}
            </Card.Body>
        </Card>
    ));



    return (
        <Container>
            <Row>
                <Col xs={12} md={5}>
                    <Button variant="warning" onClick={() => props.handlePage("home-fornecedor", { userId: props.userId })} >Voltar</Button>
                </Col>
                <Col xs={12} md={10}>
                    <h1 className="text-center">Gerenciar Pedidos</h1>
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={12}>
                    {listaPedidosLI}
                </Col>
            </Row>
        </Container>
    );
};

export default GerenciarPedidos;

