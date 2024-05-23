import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const Posts = () => {
    const [ofertas, setOfertas] = useState([]);

    useEffect(() => {
        const ofertasStorage = localStorage.getItem('ofertas');
        if (ofertasStorage) {
            setOfertas(JSON.parse(ofertasStorage));
        }
    }, []);

    const listPosts = ofertas.map((oferta) => {
        return (
            <Col key={oferta.id} xs={12} md={6} lg={4} className="mb-4">
                <Card>
                    {oferta.produtoRelacionado.imagens && oferta.produtoRelacionado.imagens.length > 0 && (
                        <Card.Img variant="top" src={oferta.produtoRelacionado.imagens[0]} />
                    )}
                    <Card.Body>
                        <Card.Title>{oferta.nomeOferta}</Card.Title>
                        <Card.Text>{oferta.descricao}</Card.Text>
                        <Card.Text><strong>Preço Especial:</strong> {oferta.precoEspecial}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        );
    });

    return (
        <Container>
            <h1>Posts</h1>
            <Row>
                {ofertas.length ? listPosts : <p>Ainda não possui posts</p>}
            </Row>
        </Container>
    );
}

export default Posts