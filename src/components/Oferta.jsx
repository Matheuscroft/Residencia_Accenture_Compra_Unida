import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel, Button, ProgressBar, Form } from 'react-bootstrap';
import { getOfertas } from '../auth/firebaseService';
import Countdown from 'react-countdown';
import '../App.css';

const Oferta = (props) => {
    const produto = props.produto;
    const [ofertas, setOfertas] = useState([]);
    const userId = props.userId

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
        const [date, time] = dataString.split(' ');
        const [day, month, year] = date.split('/');
        const [hours, minutes, seconds] = time.split(':');
        const data = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    const formatarDataCountdown = (dataString) => {
        const [date, time] = dataString.split(' ');
        const [day, month, year] = date.split('/');
        const [hours, minutes, seconds] = time.split(':');
        return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);

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

                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4} className="ml-auto">
                    <div className="d-flex flex-column align-items-end">
                        <Card className="text-center" style={{ borderColor: '#FFCD46', borderRadius: '15px' }}>
                            <Card.Body>
                                {ofertas.map((oferta, index) => (
                                    <div key={index} className="mt-3">
                                        {oferta.status === 'Concluído' && (
                                            <Card className="text-center mb-3" style={{ borderColor: 'green', borderRadius: '15px' }}>
                                                <Card.Body>
                                                    <p style={{ color: 'green', fontWeight: 'bold' }}>Oferta atingida</p>
                                                </Card.Body>
                                            </Card>
                                        )}
                                        <div className="mt-3" style={{ fontSize: "20px" }}>
                                            <strong>Tempo restante: </strong>
                                            <Countdown date={formatarDataCountdown(oferta.dataTermino)} />
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
                                            onClick={() => props.handlePage("carrinho", { userId: userId, oferta: ofertas })}
                                            style={{ marginTop: '20px', width: '100%' }}
                                            disabled={oferta.produtoRelacionado.quantidadeEstoque === 0 || userId === null}
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

export default Oferta;

