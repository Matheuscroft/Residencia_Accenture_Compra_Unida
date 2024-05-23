import React from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import NavegacaoHeader from './NavegacaoHeader';

const Produto = (props) => {
    const produto = props.produto; // Recebe o produto via props

    return (
        <Container>
            <NavegacaoHeader handlePage={props.handlePage} />
            <Row className="justify-content-md-center" style={{ marginTop: '100px' }}>
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">{produto.nomeProduto}</h1>
                            <Carousel>
                                {produto.imagens.map((imagem, index) => (
                                    <Carousel.Item key={index}>
                                        <img className="d-block w-100" src={imagem} alt={`Imagem ${index + 1}`} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <Card.Text>{produto.descricao}</Card.Text>
                            <Card.Text><strong>Categoria:</strong> {produto.categoria}</Card.Text>
                            <Card.Text><strong>Preço:</strong> {produto.preco}</Card.Text>
                            <Card.Text><strong>Quantidade em estoque:</strong> {produto.quantidadeEstoque}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Produto;

