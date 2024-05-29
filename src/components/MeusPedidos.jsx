import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const MeusPedidos = (props) => {
    
    

    return (
        <Container>
            <h1 className="text-center">MeusPedidos de Compras</h1>
            <Row>
                <Col xs={12} md={2}>
                </Col>
                <Col xs={12} md={6}>
                </Col>
                <Col xs={12} md={4}>
                    <Button
                        variant="warning"
                        onClick={() => props.handlePage("meus-pedidos")}
                        style={{ marginTop: '20px', width: '100%' }}
                    >
                        Finalizar pedido
                    </Button>
                </Col>
            </Row>
            
        </Container>
    );
};

export default MeusPedidos;
