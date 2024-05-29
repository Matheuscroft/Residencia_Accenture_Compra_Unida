import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { addPedido } from '../auth/firebaseService';

const Carrinho = (props) => {
    const [pedidos, setPedidos] = useState([]);
    const [quantidades, setQuantidades] = useState({});
    const oferta = props.oferta || []; 

    useEffect(() => {
        const initialQuantidades = {};
        oferta.forEach(item => {
            initialQuantidades[item.id] = 1; 
        });
        setQuantidades(initialQuantidades);
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
                {oferta.map(item => (
                    <Col xs={12} key={item.id} className="mb-4">
                        <Card style={{ backgroundColor: '#1c3bc5', borderColor: '#FFCD46', cursor: 'pointer' }} onClick={() => props.handlePage("produto", item.produtoRelacionado)}>
                            <Card.Body>
                                <h3 className="text-light">{item.nomeOferta}</h3>
                                <p className="text-light"><strong>Descrição:</strong> {item.descricao}</p>
                                <p className="text-light"><strong>Preço Especial:</strong> {item.precoEspecial}</p>
                                <Form.Control
                                    type="number"
                                    value={quantidades[item.id]}
                                    onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value))}
                                    min="1"
                                />
                                <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}>Remover</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <h3 className="text-center">Total: R$ {calculateTotal()}</h3>
            <Row>
                <Col xs={12}>
                    <Button
                        variant="warning"
                        onClick={handleSubmit}
                        style={{ marginTop: '20px', width: '100%' }}
                    >
                        Finalizar pedido
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Carrinho;

