import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getOfertas } from "../auth/firebaseService";
import Countdown from 'react-countdown';
import '../App.css'; // Certifique-se de que o caminho do CSS está correto

const HomeCliente = (props) => {
    const [ofertas, setOfertas] = useState([]);
    const containerRefs = useRef({});
    const cardRefs = useRef({});

    useEffect(() => {
        const fetchOfertas = async () => {
            const ofertas = await getOfertas();
            console.log("olha as ofertas do getofertas:");
            console.log(ofertas);
            setOfertas(ofertas);
        };

        fetchOfertas();
    }, []);

    const categorias = ofertas.reduce((acc, oferta) => {
        const categoria = oferta.produtoRelacionado.categoria;
        console.log('Categoria:', categoria);
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(oferta);
        return acc;
    }, {});
    console.log('Categorias:', categorias);

    const categoriasPadrao = ["alimentacao", "vestuario", "racao", "bebidas"];
    const categoriasFormatadas = {
        alimentacao: "Alimentação",
        vestuario: "Vestuário",
        racao: "Ração",
        bebidas: "Bebidas"
    };

    const melhoresOfertas = ofertas
        .map(oferta => ({
            ...oferta,
            diferencaPreco: oferta.produtoRelacionado.preco - oferta.precoEspecial
        }))
        .sort((a, b) => b.diferencaPreco - a.diferencaPreco)
        .slice(0, 10);

    const scrollLeft = (categoria) => {
        containerRefs.current[categoria].scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = (categoria) => {
        containerRefs.current[categoria].scrollBy({ left: 300, behavior: 'smooth' });
    };

    const getMaxHeight = (categoria) => {
        if (!cardRefs.current[categoria]) return 'auto';
        const heights = cardRefs.current[categoria].map(ref => ref ? ref.clientHeight : 0);
        return Math.max(...heights);
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    const handleCarrinho = (oferta) => {

        const ofertaComQntCarrinho = {
            ...oferta,
            quantidadeCarrinho: 1
        };

        console.log("entrou no handle carrinho")
        console.log(ofertaComQntCarrinho)

        props.handlePage("carrinho", [ofertaComQntCarrinho])
    };

<<<<<<< HEAD
    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
=======
    const handleCarrinho = (oferta) => {

        const ofertaComQntCarrinho = {
            ...oferta,
            quantidadeCarrinho: 1
        };

        console.log("entrou no handle carrinho")
        console.log(ofertaComQntCarrinho)

        props.handlePage("carrinho", [ofertaComQntCarrinho])
>>>>>>> refs/remotes/origin/main
    };

    return (
        <div>
            <Container style={{ marginTop: '20px' }}>
                <h2 style={{ color: '#FFCD46' }}>Melhores Ofertas</h2>
                <div style={{ position: 'relative', marginBottom: '40px' }}>
                    {melhoresOfertas.length >= 3 && (
                        <Button
                            style={{
                                position: 'absolute',
                                left: '-50px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                                backgroundColor: '#FFCD46',
                                borderColor: '#FFCD46'
                            }}
                            onClick={() => scrollLeft('melhoresOfertas')}
                        >
                            &lt;
                        </Button>
                    )}
                    <div
                        ref={(el) => (containerRefs.current['melhoresOfertas'] = el)}
                        style={{
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            scrollbarWidth: 'none', /* Firefox */
                            msOverflowStyle: 'none', /* Internet Explorer 10+ */
                            scrollBehavior: 'smooth' /* Suavizar o scroll */
                        }}
                        className="scroll-container"
                    >
                        <Row style={{ display: 'flex', flexWrap: 'nowrap' }}>
                            {melhoresOfertas.length > 0 ? (
                                melhoresOfertas.map((oferta, index) => (
                                    <Col key={oferta.id} xs={12} md={6} lg={4} className="mb-4" style={{ display: 'inline-block', float: 'none' }}>
                                        <Card
                                            ref={el => {
                                                if (!cardRefs.current['melhoresOfertas']) {
                                                    cardRefs.current['melhoresOfertas'] = [];
                                                }
                                                cardRefs.current['melhoresOfertas'][index] = el;
                                            }}
                                            className="offer-card"
                                            onClick={() => props.handlePage("produto", oferta.produtoRelacionado)}
                                        >
                                            <div style={{ backgroundColor: 'white' }}>
                                                {oferta.produtoRelacionado.imagens && oferta.produtoRelacionado.imagens.length > 0 && (
                                                    <Card.Img
                                                        variant="top"
                                                        src={oferta.produtoRelacionado.imagens[0]}
                                                        style={{ height: '150px', objectFit: 'contain', cursor: 'pointer' }}
                                                    />
                                                )}
                                            </div>
                                            <Card.Body style={{ backgroundColor: '#1c3bc5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <div>
                                                    <Card.Title style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }} title={oferta.nomeOferta}>{oferta.nomeOferta}</Card.Title>
                                                    <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }} title={oferta.descricao}>{oferta.descricao}</Card.Text>
                                                    <Card.Text style={{ textDecoration: 'line-through', color: 'red' }}><strong>Preço:</strong> {oferta.produtoRelacionado.preco}</Card.Text>
                                                    <Card.Text style={{ color: 'white' }}><strong>Preço Especial:</strong> {oferta.precoEspecial}</Card.Text>
                                                    <Card.Text style={{ color: 'white' }}><strong>Tempo Restante:</strong> <Countdown date={new Date(oferta.dataTermino)} /></Card.Text>
                                                    <Card.Text style={{ color: 'white' }}><strong>Data de Finalização:</strong> {formatarData(oferta.dataTermino)}</Card.Text>
                                                    <Card.Text style={{ color: 'white' }}><strong>Vendidos:</strong> {oferta.quantidadeVendida || 0}/{oferta.produtoRelacionado.quantidadeEstoque}</Card.Text>
                                                </div>
                                                <Button
                                                    variant="warning"
<<<<<<< HEAD
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        props.handlePage("carrinho", [oferta]);
                                                    }}
=======
                                                    onClick={() => handleCarrinho(oferta)}
>>>>>>> refs/remotes/origin/main
                                                    style={{ marginTop: '20px', width: '100%' }}
                                                >
                                                    Adicionar ao Carrinho
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12} md={6} lg={4} className="mb-4" style={{ display: 'inline-block', float: 'none' }}>
                                <Card style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                                    <Card.Body>
                                        <Card.Title className="text-light">Sem ofertas</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </div>
                {melhoresOfertas.length >= 3 && (
                    <Button
                        style={{
                            position: 'absolute',
                            right: '-50px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                            backgroundColor: '#FFCD46',
                            borderColor: '#FFCD46'
                        }}
                        onClick={() => scrollRight('melhoresOfertas')}
                    >
                        &gt;
                    </Button>
                )}
            </div>

            {categoriasPadrao.map((categoria) => (
                <div key={categoria} style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: '#FFCD46' }}>{categoriasFormatadas[categoria]}</h3>
                    <div style={{ position: 'relative' }}>
                        {categorias[categoria] && categorias[categoria].length >= 3 && (
                            <Button
                                style={{
                                    position: 'absolute',
                                    left: '-50px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1,
                                    backgroundColor: '#FFCD46',
                                    borderColor: '#FFCD46'
                                }}
                                onClick={() => scrollLeft(categoria)}
                            >
                                &lt;
                            </Button>
                        )}
                        <div
                            ref={(el) => (containerRefs.current[categoria] = el)}
                            style={{
                                overflowX: 'auto',
                                whiteSpace: 'nowrap',
                                scrollbarWidth: 'none', /* Firefox */
                                msOverflowStyle: 'none', /* Internet Explorer 10+ */
                                scrollBehavior: 'smooth',
                            }}
                            className="scroll-container"
                        >
                            <Row style={{ display: 'flex', flexWrap: 'nowrap' }}>
                                {categorias[categoria] && categorias[categoria].length > 0 ? (
                                    categorias[categoria].map((oferta, index) => (
                                        <Col key={oferta.id} xs={12} md={6} lg={4} className="mb-4" style={{ display: 'inline-block', float: 'none' }}>
                                            <Card
                                                ref={el => {
                                                    if (!cardRefs.current[categoria]) {
                                                        cardRefs.current[categoria] = [];
                                                    }
                                                    cardRefs.current[categoria][index] = el;
                                                }}
                                                className="offer-card"
                                                onClick={() => props.handlePage("produto", oferta.produtoRelacionado)}
                                            >
                                                <div style={{ backgroundColor: 'white' }}>
                                                    {oferta.produtoRelacionado.imagens && oferta.produtoRelacionado.imagens.length > 0 && (
                                                        <Card.Img
                                                            variant="top"
                                                            src={oferta.produtoRelacionado.imagens[0]}
                                                            style={{ height: '150px', objectFit: 'contain', cursor: 'pointer' }}
                                                        />
                                                    )}
<<<<<<< HEAD
                                                </div>
                                                <Card.Body style={{ backgroundColor: '#1c3bc5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <Card.Title style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }} title={oferta.nomeOferta}>{oferta.nomeOferta}</Card.Title>
                                                        <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }} title={oferta.descricao}>{oferta.descricao}</Card.Text>
                                                        <Card.Text style={{ textDecoration: 'line-through', color: 'red' }}><strong>Preço:</strong> {oferta.produtoRelacionado.preco}</Card.Text>
                                                        <Card.Text style={{ color: 'white' }}><strong>Preço Especial:</strong> {oferta.precoEspecial}</Card.Text>
                                                        <Card.Text style={{ color: 'white' }}><strong>Tempo Restante:</strong> <Countdown date={new Date(oferta.dataTermino)} /></Card.Text>
                                                        <Card.Text style={{ color: 'white' }}><strong>Data de Finalização:</strong> {formatarData(oferta.dataTermino)}</Card.Text>
                                                        <Card.Text style={{ color: 'white' }}><strong>Vendidos:</strong> {oferta.quantidadeVendida || 0}/{oferta.produtoRelacionado.quantidadeEstoque}</Card.Text>
                                                    </div>
                                                    <Button
                                                        variant="warning"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            props.handlePage("carrinho", [oferta]);
                                                        }}
                                                        style={{ marginTop: '20px', width: '100%' }}
                                                    >
                                                        Adicionar ao Carrinho
                                                    </Button>
=======
                                                    <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <div>
                                                            <Card.Title style={{ whiteSpace: 'normal', overflow: 'visible' }}>{oferta.nomeOferta}</Card.Title>
                                                            <Card.Text style={{ whiteSpace: 'normal', overflow: 'visible' }}>{oferta.descricao}</Card.Text>
                                                            <Card.Text><strong>Preço Especial:</strong> {oferta.precoEspecial}</Card.Text>
                                                        </div>
                                                        <Button
                                                            variant="warning"
                                                            onClick={() => handleCarrinho(oferta)}
                                                            style={{ marginTop: '20px', width: '100%' }}
                                                        >
                                                            Adicionar ao Carrinho
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <Col xs={12} md={6} lg={4} className="mb-4" style={{ display: 'inline-block', float: 'none' }}>
                                            <Card style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                                                <Card.Body>
                                                    <Card.Title className="text-light">Sem ofertas</Card.Title>
>>>>>>> refs/remotes/origin/main
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col xs={12} md={6} lg={4} className="mb-4" style={{ display: 'inline-block', float: 'none' }}>
                                        <Card style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                                            <Card.Body>
                                                <Card.Title className="text-light">Sem ofertas</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )}
                            </Row>
                        </div>
                        {categorias[categoria] && categorias[categoria].length >= 3 && (
                            <Button
                                style={{
                                    position: 'absolute',
                                    right: '-50px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1,
                                    backgroundColor: '#FFCD46',
                                    borderColor: '#FFCD46'
                                }}
                                onClick={() => scrollRight(categoria)}
                            >
                                &gt;
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </Container>
    </div>
);
};

export default HomeCliente;
