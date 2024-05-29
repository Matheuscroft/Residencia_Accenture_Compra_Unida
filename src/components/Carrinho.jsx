import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { addPedido, updateCarrinho, getCarrinho, addCarrinho } from '../auth/firebaseService';

const Carrinho = (props) => {
    const [pedidos, setPedidos] = useState([]);
    const [quantidades, setQuantidades] = useState({});
    const oferta = props.oferta || []; 
    const [ofertas, setOfertas] = useState(props.oferta || []);

    useEffect(() => {
        const quantidadesIniciais = {};
        oferta.forEach(item => {
            quantidadesIniciais[item.id] = item.quantidadeCarrinho || 1;
        });
        setQuantidades(quantidadesIniciais);
    }, [oferta]);

    useEffect(() => {
        const carregarCarrinho = async () => {
            const carrinhoAtual = await getCarrinho();
            let ofertasAtualizadas;
    
            if (props.oferta && props.oferta.length > 0) {
                if (carrinhoAtual) {
                    ofertasAtualizadas = [...carrinhoAtual.ofertas];
    
                    props.oferta.forEach(novaOferta => {
                        const ofertaExistente = ofertasAtualizadas.find(oferta => oferta.id === novaOferta.id);
                        if (ofertaExistente) {
                            // Atualiza a quantidade se for diferente
                            if (ofertaExistente.quantidadeCarrinho !== novaOferta.quantidadeCarrinho) {
                                ofertaExistente.quantidadeCarrinho = novaOferta.quantidadeCarrinho;
                            }
                        } else {
                            ofertasAtualizadas.push(novaOferta);
                        }
                    });
    
                    await updateCarrinho(carrinhoAtual.id, ofertasAtualizadas);
                } else {
                    const id = await addCarrinho(props.oferta);
                    ofertasAtualizadas = props.oferta;
                }
    
                setOfertas(ofertasAtualizadas);
    
                const quantidadesIniciais = {};
                ofertasAtualizadas.forEach(item => {
                    quantidadesIniciais[item.id] = item.quantidadeCarrinho || 1;
                });
                setQuantidades(quantidadesIniciais);
            } else {
                if (carrinhoAtual) {
                    setOfertas(carrinhoAtual.ofertas);
                    const quantidadesIniciais = {};
                    carrinhoAtual.ofertas.forEach(item => {
                        quantidadesIniciais[item.id] = item.quantidadeCarrinho || 1;
                    });
                    setQuantidades(quantidadesIniciais);

                }
            }
        };
    
        carregarCarrinho();
    }, []);
    
    

    const handleQuantidadeChange = async (id, quantidade) => {
        setQuantidades({
            ...quantidades,
            [id]: quantidade
        });
    
        const updatedOfertas = ofertas.map(item => {
            if (item.id === id) {
                item.quantidadeCarrinho = quantidade;
            }
            return item;
        });
    
        setOfertas(updatedOfertas);
    
        const carrinho = await getCarrinho();
        if (carrinho) {
            await updateCarrinho(carrinho.id, updatedOfertas);
        }
    };
    

    const handleRemove = async (id) => {
        
        const novaOferta = ofertas.filter(item => item.id !== id);
        setOfertas(novaOferta);

        const carrinho = await getCarrinho();
        if (carrinho) {
            const ofertasAtualizadas = carrinho.ofertas.filter(item => item.id !== id);
            await updateCarrinho(carrinho.id, ofertasAtualizadas);
        }

        console.log("removeu")
        console.log(novaOferta)
        console.log("olha carrinho")
        console.log(carrinho)
    };

    const handleSubmit = async () => {
        const updatedOfertas = ofertas.map(item => {
            item.quantidadeVendas = (item.quantidadeVendas || 0) + item.quantidadeCarrinho;
            item.quantidadeCarrinho = 0;
            item.status = 'vendida';
            return item;
        });
    
        const novoPedido = {
            ofertaRelacionada: [...updatedOfertas],
            dataDePedido: new Date(),
            valorPedido: updatedOfertas.reduce((total, item) => total + (parseFloat(item.precoEspecial.replace('R$', '').replace(',', '.')) * item.quantidadeVendas), 0).toFixed(2)
        };
    
        setPedidos([...pedidos, novoPedido]);
    
        const id = await addPedido(novoPedido);
        if (id) {
            alert(`${novoPedido.ofertaRelacionada[0].nomeOferta} cadastrado com sucesso com ID: ${id}`);
            props.handlePage("meus-pedidos");
        } else {
            alert("Erro ao cadastrar pedido");
        }
    
        const carrinho = await getCarrinho();
        if (carrinho) {
            await updateCarrinho(carrinho.id, []);
        }
    
        setOfertas([]);
    };
    

    const calcularTotal = () => {
    
        let total = 0;
    
        ofertas.forEach(item => {
           
            const valorOferta = parseFloat(item.precoEspecial.replace('R$', '').replace(',', '.')) * item.quantidadeCarrinho;
            
            total += valorOferta;
        });
    
       
        return total.toFixed(2);
    };
    

    return (
        <Container>
            <h1 className="text-center">Carrinho de Compras</h1>
            <Row>
                <Col xs={12} md={8}>
                    <Card className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <Button variant="link" onClick={() => props.handlePage("home")}>Continuar comprando</Button>
                            <Button variant="warning" onClick={handleSubmit}>Finalizar pedido</Button>
                        </Card.Header>
                        <Card.Body>
                            {ofertas.map(item => (
                                <Row key={item.id} className="mb-3 align-items-center">
                                    <Col xs={2}>
                                        <img src={item.produtoRelacionado.imagens[0]} alt={item.nomeOferta} style={{ width: '100%' }} />
                                    </Col>
                                    <Col xs={4}>
                                        <h5>{item.nomeOferta}</h5>
                                        <p>{item.descricao}</p>
                                    </Col>
                                    <Col xs={2}>
                                        <Form.Control
                                            type="number"
                                            value={quantidades[item.id]}
                                            onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value))}
                                            min="1"
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <p>{item.precoEspecial}</p>
                                    </Col>
                                    <Col xs={2}>
                                    <Button variant="danger" onClick={() => handleRemove(item.id)}>Remover</Button>
                                    </Col>
                                </Row>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body>
                            <h5>Resumo</h5>
                            <p>Total em produtos: R$ {calcularTotal()}</p>
                            <h3>Total: R$ {calcularTotal()}</h3>
                            <Button variant="warning" onClick={handleSubmit} className="w-100">Confirmar</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Carrinho;

