import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel, Button, ProgressBar } from 'react-bootstrap';
import { getOfertas } from '../auth/firebaseService';
import { format } from 'date-fns';
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

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return format(data, 'dd/MM/yyyy');
    };

    const calcularProgresso = (quantidadeMinima, vendidos) => {
        return (vendidos / quantidadeMinima) * 100;
    };

    return (
        <Container>
            <Row className="justify-content-md-center" style={{ marginTop: '100px' }}>
                <Col xs={12} md={2}>
                </Col>
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
                                    <p><strong>Data de início da oferta:</strong> {formatarData(oferta.dataInicio)}</p>
                                </div>
                            ))}
                            <Chat fornecedorId={produto.fornecedorId} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4} className="ml-auto">
                    <div className="d-flex flex-column align-items-end">
                        <Card className="text-center" style={{ borderColor: '#FFCD46', borderRadius: '15px' }}>
                            <Card.Body>
                            {ofertas.map((oferta, index) => (
                                <div key={index} className="mt-3">
                                    <div className="mt-3" style={{ fontSize: "20px" }}>
                                        <strong>Tempo restante: </strong>
                                        <Countdown date={new Date(oferta.dataTermino)} />
                                    </div>
                                    <p>Oferta termina em: {formatarData(oferta.dataTermino)}</p>
                                    
                                    <p style={{ marginTop: "50px" }}><strong>Quantidade mínima:</strong> {oferta.quantidadeMinima}</p>
                                    
                                    <p><strong>Quantidade vendida:</strong> {oferta.quantidadeVendida}</p>
                                    <ProgressBar 
                                        now={calcularProgresso(oferta.quantidadeMinima, oferta.quantidadeVendas)} 
                                        label={`${oferta.quantidadeVendas} / ${oferta.quantidadeMinima}`} 
                                    />
                                    
                                    <p style={{ textDecoration: 'line-through', color: "red", marginTop: "50px" }}><strong>De:</strong> {oferta.produtoRelacionado.preco}</p>
                                    <p style={{ fontSize: "20px" }}><strong>Por:</strong> {oferta.precoEspecial}</p>
                                </div>
                            ))}
                                <Button
                                    variant="warning"
                                    onClick={() => props.handlePage("carrinho") }
                                    style={{ marginTop: '20px', width: '100%' }}
                                >
                                    Adicionar ao Carrinho
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Produto;

