import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel, Button, ProgressBar, Form } from 'react-bootstrap';
import { getOfertas } from '../auth/firebaseService';
import { format } from 'date-fns';
import Countdown from 'react-countdown';
import Chat from './Chat';
import '../App.css';

const Produto = (props) => {
    const produto = props.produto;
    const [ofertas, setOfertas] = useState([]);

    useEffect(() => {
        const fetchOfertas = async () => {
            const todasOfertas = await getOfertas();
            const ofertasProduto = todasOfertas.filter(oferta => oferta.produtoRelacionado.id === produto.id).map(oferta => ({
                ...oferta,
                quantidadeCarrinho: oferta.produtoRelacionado.quantidadeEstoque > 0 ? 1 : 0
            }));
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

    const handleMudancaQuantidade = (index, value) => {
        setOfertas((ofertasAnteriores) => {
            const novasOfertas = [...ofertasAnteriores];
            const quantidadeMaxima = novasOfertas[index].produtoRelacionado.quantidadeEstoque;
            if (quantidadeMaxima === 0) {
                novasOfertas[index].quantidadeCarrinho = 0;
            } else {
                novasOfertas[index].quantidadeCarrinho = Math.min(Math.max(1, value), quantidadeMaxima);
            }
            return novasOfertas;
        });
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

                                        <p style={{ marginTop: "50px" }}><strong>Estoque disponível:</strong> {oferta.produtoRelacionado.quantidadeEstoque}</p>
                                        <p><strong>Quantidade mínima:</strong> {oferta.quantidadeMinima}</p>

                                        <p><strong>Quantidade vendida:</strong> {oferta.quantidadeVendida}</p>
                                        <ProgressBar
                                            now={calcularProgresso(oferta.quantidadeMinima, oferta.quantidadeVendas)}
                                            label={`${oferta.quantidadeVendas} / ${oferta.quantidadeMinima}`}
                                        />

                                        <p style={{ textDecoration: 'line-through', color: "red", marginTop: "50px" }}><strong>De:</strong> {oferta.produtoRelacionado.preco}</p>
                                        <p style={{ fontSize: "20px" }}><strong>Por:</strong> {oferta.precoEspecial}</p>
                                        <div className="d-flex align-items-center justify-content-center" >
                                            <Button variant="outline-secondary" onClick={() => handleMudancaQuantidade(index, oferta.quantidadeCarrinho - 1)} disabled={oferta.produtoRelacionado.quantidadeEstoque === 0}>-</Button>
                                            <Form.Control
                                                type="number"
                                                value={oferta.quantidadeCarrinho}
                                                onChange={(e) => handleMudancaQuantidade(index, parseInt(e.target.value))}
                                                style={{ width: '80px', margin: '0 10px' }}
                                                max={oferta.produtoRelacionado.quantidadeEstoque}
                                                min={oferta.produtoRelacionado.quantidadeEstoque === 0 ? "0" : "1"}
                                                disabled={oferta.produtoRelacionado.quantidadeEstoque === 0}
                                            />
                                            <Button variant="outline-secondary" onClick={() => handleMudancaQuantidade(index, oferta.quantidadeCarrinho + 1)} disabled={oferta.produtoRelacionado.quantidadeEstoque === 0}>+</Button>
                                        </div>
                                        <Button
                                            variant="warning"
                                            onClick={() => props.handlePage("carrinho", ofertas)}
                                            style={{ marginTop: '20px', width: '100%' }}
                                            disabled={oferta.produtoRelacionado.quantidadeEstoque === 0}
                                        >
                                            Adicionar ao Carrinho
                                        </Button>
                                    </div>
                                ))}

                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Produto;

