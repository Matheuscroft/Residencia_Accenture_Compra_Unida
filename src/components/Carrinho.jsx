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
            if (props.oferta && props.oferta.length > 0) {
                const carrinhoAtual = await getCarrinho();
                let ofertasAtualizadas;
                
                if (carrinhoAtual) {
                    ofertasAtualizadas = [...carrinhoAtual.ofertas, ...props.oferta];
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
                const carrinho = await getCarrinho();
                if (carrinho) {
                    setOfertas(carrinho.ofertas);
                    const quantidadesIniciais = {};
                    carrinho.ofertas.forEach(item => {
                        quantidadesIniciais[item.id] = item.quantidadeCarrinho || 1;
                    });
                    setQuantidades(quantidadesIniciais);
                }
            }
        };
        carregarCarrinho();
    }, [props.oferta]);
    

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
    

    const handleRemove = (id) => {
        const newOferta = oferta.filter(item => item.id !== id);
        props.setOferta(newOferta);
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
    

    const calculateTotal = () => {
        return oferta.reduce((total, item) => total + (parseFloat(item.precoEspecial.replace('R$', '').replace(',', '.')) * quantidades[item.id]), 0).toFixed(2);
    };

    return (
        <Container>
            <h1 className="text-center">Carrinho de Compras</h1>
            <Row>
                {ofertas.map(item => (
                    <Col xs={12} key={item.id} className="mb-4">
                        <Card style={{ backgroundColor: '#1c3bc5', borderColor: '#FFCD46', cursor: 'pointer' }} onClick={() => props.handlePage("produto", item.produtoRelacionado)}>
                            <Card.Body>
                                <h3 className="text-light">{item.nomeOferta}</h3>
                                <p className="text-light"><strong>Descrição:</strong> {item.descricao}</p>
                                <p className="text-light"><strong>Preço Especial:</strong> {item.precoEspecial}</p>
                                <Form.Control
                                    type="number"
                                    value={quantidades[item.id]}
                                    onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value))}
                                    min="1"
                                />
                                <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}>Remover</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <h3 className="text-center">Total: R$ {calculateTotal()}</h3>
            <Row>
                <Col xs={12}>
                    <Button
                        variant="warning"
                        onClick={handleSubmit}
                        style={{ marginTop: '20px', width: '100%' }}
                    >
                        Finalizar pedido
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Carrinho;

