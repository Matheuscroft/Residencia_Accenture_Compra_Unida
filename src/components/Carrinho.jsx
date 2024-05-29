import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { addPedido } from '../auth/firebaseService';

const Carrinho = (props) => {
    const [pedidos, setPedidos] = useState([]);
    const [quantidades, setQuantidades] = useState({});
    const oferta = props.oferta || []; 
    const [ofertas, setOfertas] = useState(props.oferta || []);

    useEffect(() => {
        const quantidadesIniciais = {};
        oferta.forEach(item => {
            quantidadesIniciais[item.id] = item.quantidadeCarrinho || 1;
        });
        setQuantidades(quantidadesIniciais);
    }, [oferta]);

    const handleQuantidadeChange = (id, quantidade) => {
        setQuantidades({
            ...quantidades,
            [id]: quantidade
        });
    };

    const handleRemove = (id) => {
        const newOferta = oferta.filter(item => item.id !== id);
        props.setOferta(newOferta);
    };

    const handleSubmit = async () => {
        const novoPedido = {
            ofertaRelacionada: oferta,
            dataDePedido: new Date(),
            valorPedido: oferta.reduce((total, item) => total + (parseFloat(item.precoEspecial.replace('R$', '').replace(',', '.')) * quantidades[item.id]), 0).toFixed(2)
        };

        setPedidos([...pedidos, novoPedido]);

        const id = await addPedido(novoPedido);
        if (id) {
            alert(`${novoPedido.ofertaRelacionada[0].nomeOferta} cadastrado com sucesso com ID: ${id}`);
            props.handlePage("meus-pedidos");
        } else {
            alert("Erro ao cadastrar pedido");
        }
    };

    const calculateTotal = () => {
        return oferta.reduce((total, item) => total + (parseFloat(item.precoEspecial.replace('R$', '').replace(',', '.')) * quantidades[item.id]), 0).toFixed(2);
    };

    return (
        <Container>
            <h1 className="text-center">Carrinho de Compras</h1>
            <Row>
                <Col xs={12} md={8}>
                    <Card className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <Button variant="link" onClick={() => props.handlePage("home")}>Continuar comprando</Button>
                            <Button variant="warning" onClick={handleSubmit}>Finalizar pedido</Button>
                        </Card.Header>
                        <Card.Body>
                            {ofertas.map(item => (
                                <Row key={item.id} className="mb-3 align-items-center">
                                    <Col xs={2}>
                                        <img src={item.produtoRelacionado.imagens[0]} alt={item.nomeOferta} style={{ width: '100%' }} />
                                    </Col>
                                    <Col xs={4}>
                                        <h5>{item.nomeOferta}</h5>
                                        <p>{item.descricao}</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Form.Control
                                            type="number"
                                            value={quantidades[item.id]}
                                            onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value))}
                                            min="1"
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <p>{item.precoEspecial}</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}>Remover</Button>
                                    </Col>
                                </Row>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body>
                            <h5>Resumo</h5>
                            <p>Total em produtos: R$ {calculateTotal()}</p>
                            <h3>Total: R$ {calculateTotal()}</h3>
                            <Button variant="warning" onClick={handleSubmit} className="w-100">Confirmar</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Carrinho;

