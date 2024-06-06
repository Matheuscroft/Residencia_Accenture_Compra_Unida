import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { addPedido, updateCarrinho, getCarrinho, addCarrinho, editarOferta, getProdutos, editarProduto } from '../auth/firebaseService';
import {formatarDataString} from './Utils'

const Carrinho = (props) => {
    const [pedidos, setPedidos] = useState([]);
    const [quantidades, setQuantidades] = useState({});
    const [ofertas, setOfertas] = useState(props.oferta || []);
    const [showAlert, setShowAlert] = useState(false);

    const oferta = useMemo(() => props.oferta || [], [props.oferta]);
    const userId= props.userId

    useEffect(() => {
        const quantidadesIniciais = {};
        oferta.forEach(item => {
            quantidadesIniciais[item.id] = item.quantidadeCarrinho || 1;
        });
        setQuantidades(quantidadesIniciais);

        console.log("userId carrinho:")
        console.log(userId)
        console.log("oferta carrinho:")
        console.log(oferta)

    }, [oferta]);

    useEffect(() => {
        const carregarCarrinho = async () => {
            const carrinhoAtual = await getCarrinho(userId);
            let ofertasAtualizadas;

            if (props.oferta && props.oferta.length > 0) {
                if (carrinhoAtual) {
                    ofertasAtualizadas = [...carrinhoAtual.ofertas];

                    props.oferta.forEach(novaOferta => {
                        const ofertaExistente = ofertasAtualizadas.find(oferta => oferta.id === novaOferta.id);
                        if (ofertaExistente) {
                            
                            if (ofertaExistente.quantidadeCarrinho !== novaOferta.quantidadeCarrinho) {
                                ofertaExistente.quantidadeCarrinho = novaOferta.quantidadeCarrinho;
                            }
                        } else {
                            ofertasAtualizadas.push(novaOferta);
                        }
                    });

                    await updateCarrinho(carrinhoAtual.id, ofertasAtualizadas);
                } else {
                    const id = await addCarrinho(props.oferta, userId);
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
    }, [props.oferta]);

    const handleQuantidadeChange = async (id, quantidade) => {
        const item = ofertas.find(item => item.id === id);
        const quantidadeMaxima = item.produtoRelacionado.quantidadeEstoque;
        const quantidadeAtualizada = Math.max(1, Math.min(quantidade, quantidadeMaxima));
    
        setQuantidades({
            ...quantidades,
            [id]: quantidadeAtualizada
        });
    
        const updatedOfertas = ofertas.map(item => {
            if (item.id === id) {
                item.quantidadeCarrinho = quantidadeAtualizada;
            }
            return item;
        });
    
        setOfertas(updatedOfertas);
    
        const carrinho = await getCarrinho(userId);
        if (carrinho) {
            await updateCarrinho(carrinho.id, updatedOfertas);
        }
    };

    const handleRemove = async (id) => {
        const novaOferta = ofertas.filter(item => item.id !== id);
        setOfertas(novaOferta);

        const carrinho = await getCarrinho(userId);
        if (carrinho) {
            const ofertasAtualizadas = carrinho.ofertas.filter(item => item.id !== id);
            await updateCarrinho(carrinho.id, ofertasAtualizadas);
        }
    };

    const handleSubmit = async () => {
        if (ofertas.length === 0) { 
            setShowAlert(true);
            return;
        }

        const ofertasAtualizadas = ofertas.map(oferta => {
            const quantidadeVendaPedidoAtual = oferta.quantidadeCarrinho;
            if (oferta.status !== 'Concluído') {
                oferta.status = 'Pendente';
            }
            oferta.quantidadeVendas = (oferta.quantidadeVendas || 0) + quantidadeVendaPedidoAtual;
            oferta.quantidadeCarrinho = 0;
            return { ...oferta, quantidadeVendaPedidoAtual };
        });

        const todosProdutos = await getProdutos();

        for (const oferta of ofertasAtualizadas) {
            const produto = todosProdutos.find(prod => prod.id === oferta.produtoRelacionado.id);

            if (produto) {
                const novaQuantidadeEstoque = produto.quantidadeEstoque - oferta.quantidadeVendaPedidoAtual;
                const produtoComEstoqueAtualizado = {
                    ...produto,
                    quantidadeEstoque: novaQuantidadeEstoque,
                    quantidadeVendas: oferta.quantidadeVendas,
                    idComprador: userId
                };

                await editarProduto(oferta.produtoRelacionado.id, produtoComEstoqueAtualizado);

                oferta.produtoRelacionado = produtoComEstoqueAtualizado;
                await editarOferta(oferta.id, oferta);
            }
        }

        const novoPedido = {
            ofertasRelacionadas: ofertasAtualizadas.map(oferta => {
                const { quantidadeVendaPedidoAtual, ...rest } = oferta;
                return { ...rest, quantidadeVendas: quantidadeVendaPedidoAtual };
            }),
            dataDePedido: formatarDataString(new Date()),
            valorPedido: ofertasAtualizadas.reduce((total, oferta) => total + (parseFloat(oferta.precoEspecial.replace('R$', '').replace(',', '.')) * oferta.quantidadeVendaPedidoAtual), 0),
            idComprador: userId
        };

        console.log("novoPedido")
        console.log(novoPedido)

        setPedidos([...pedidos, novoPedido]);

        const id = await addPedido(novoPedido);
        if (id) {
            alert(`${novoPedido.ofertasRelacionadas[0].nomeOferta} cadastrado com sucesso com ID: ${id}`);
            props.handlePage("meus-pedidos", { userId: userId });
        } else {
            alert("Erro ao cadastrar pedido");
        }

        const carrinho = await getCarrinho(userId);
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
            {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                O carrinho está vazio! Por favor, adicione alguma oferta.
            </Alert>}
            <h1 className="text-center">Carrinho de Compras</h1>
            <Row>
                <Col xs={12} md={8}>
                    <Card className="mb-4">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <Button variant="link" onClick={() => props.handlePage("home-cliente", { userId: props.userId })} style={{ color: 'black' }}>Continuar comprando</Button>
                            <Button variant="warning" onClick={handleSubmit} disabled={ofertas.length === 0}>Finalizar pedido</Button>
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
                                            max={item.produtoRelacionado.quantidadeEstoque}
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
                            <Button variant="warning" onClick={handleSubmit} className="w-100" disabled={ofertas.length === 0}>Confirmar</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Carrinho;

