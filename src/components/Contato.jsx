import React from 'react';
import { Card, Container, Row, Col, ListGroup } from 'react-bootstrap';

const Contato = () => {
    const membros = [
        "Liliana Barbosa Alencar",
        "Mateus Pereira de Lima",
        "Matheus de Oliveira Santos",
        "Matheus Marques da Silva",
        "Renan Argôlo Carvalho Miranda",
        "Renan Lima da Silva Oliveira"
    ];

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Header as="h4">Squad 5</Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {membros.map((membro, index) => (
                                    <ListGroup.Item key={index}>{membro}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title style={{ fontSize: '1.5rem' }}>Matheus OS Developer</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Contato;
