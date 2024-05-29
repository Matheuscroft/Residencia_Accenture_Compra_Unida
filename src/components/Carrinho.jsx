import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
//import { CartContext } from './CartContext';
import { addPedido } from '../auth/firebaseService';

const Carrinho = (props) => {
    //const { cart, removeFromCart } = useContext(CartContext);
    const [pedidos, setPedidos] = useState([])
    const oferta = props.oferta;

    /* const calculateTotal = () => {
         return cart.reduce((total, oferta) => total + parseFloat(oferta.precoEspecial.replace('R$', '').replace(',', '.')), 0).toFixed(2);
     };*/

    useEffect(() => {

        console.log("olha a oferta")
        console.log(oferta)

    }, [])

    const handleSubmit = async () => {


        const novoPedido = {
            ofertaRelacionada: oferta,
            dataDePedido: new Date(),
            valorPedido: oferta.reduce((total, item) => total + parseFloat(item.precoEspecial.replace('R$', '').replace(',', '.')), 0).toFixed(2) // Calculate total order value
        };

        console.log("olha o novoPedido")
        console.log(novoPedido)

        setPedidos([...pedidos, novoPedido]);

        const id = await addPedido(novoPedido);
        if (id) {
            alert(`${novoPedido.ofertaRelacionada[0].nomeOferta} cadastrado com sucesso com ID: ${id}`);
            props.handlePage("meus-pedidos");
        } else {
            alert("Erro ao cadastrar pedido");
        }


        props.handlePage("meus-pedidos")
    }

    return (
        <Container>
            <h1 className="text-center">Carrinho de Compras</h1>
            <Row>
                <Col xs={12} md={2}>
                    <h1>AMO VC</h1>
                </Col>
                <Col xs={12} md={6}>
                    <h1>{oferta[0].nomeOferta}</h1>
                </Col>
                <Col xs={12} md={4}>
                    <Button
                        variant="warning"
                        onClick={handleSubmit}
                        style={{ marginTop: '20px', width: '100%' }}
                    >
                        Finalizar pedido
                    </Button>

                </Col>
            </Row>
            {/*cart.length > 0 ? (
                <>
                    <Row>
                        {/*cart.map((oferta) => (
                            <Col xs={12} key={oferta.id} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <h3>{oferta.nomeOferta}</h3>
                                        <p><strong>Descrição:</strong> {oferta.descricao}</p>
                                        <p><strong>Preço Especial:</strong> {oferta.precoEspecial}</p>
                                        <p><strong>Quantidade mínima:</strong> {oferta.quantidadeMinima}</p>
                                        <Button variant="danger" onClick={() => removeFromCart(oferta.id)}>Remover</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <h3 className="text-center">Total: R$ {/*calculateTotal()}</h3>
                </>
            ) : (
                <h3 className="text-center">Seu carrinho está vazio</h3>
            )*/}
        </Container>
    );
};

export default Carrinho;
