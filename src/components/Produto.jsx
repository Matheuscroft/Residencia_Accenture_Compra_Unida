import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import NavegacaoHeader from './NavegacaoHeader';
import { getOfertas } from '../auth/firebaseService';
import Countdown from 'react-countdown';
import Chat from './Chat';
import '../App.css';

const Produto = (props) => {
    const produto = props.produto; // Recebe o produto via props
    const [ofertas, setOfertas] = useState([]);

    useEffect(() => {
        const fetchOfertas = async () => {
            const todasOfertas = await getOfertas();
            const ofertasProduto = todasOfertas.filter(oferta => oferta.produtoRelacionado.id === produto.id);
            setOfertas(ofertasProduto);
        };
        fetchOfertas();
    }, [produto.id]);

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
                            {ofertas.map((oferta, index) => (
                                <div key={index} className="mt-3">
                                    <h3>{oferta.nomeOferta}</h3>
                                    <p>{oferta.descricao}</p>
                                    <p><strong>Preço especial:</strong> {oferta.precoEspecial}</p>
                                    <p><strong>Quantidade mínima:</strong> {oferta.quantidadeMinima}</p>
                                    <p><strong>Data de início:</strong> {oferta.dataInicio}</p>
                                    <p><strong>Data de término:</strong> {oferta.dataTermino}</p>
                                    <Countdown date={oferta.dataTermino} />
                                </div>
                            ))}
                            <Chat fornecedorId={produto.fornecedorId} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Produto;

