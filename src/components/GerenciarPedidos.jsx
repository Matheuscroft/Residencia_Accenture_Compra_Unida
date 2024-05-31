import React, { useEffect, useState } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import { getPedidos } from '../auth/firebaseService';

const GerenciarPedidos = (props) => {
    

    const [listaPedidos, setListaPedidos] = useState([]);

    useEffect(() => {

        const fetchPedidos = async () => {
            const pedidos = await getPedidos();
            console.log("olha os pedidos do getPedidos:")
            console.log(pedidos)
            setListaPedidos(pedidos);
        };

        fetchPedidos();
       
    }, []);

    const listaPedidosLI = listaPedidos.map((pedido) => (
        <li key={pedido.id} style={{ marginBottom: "20px" }}>
            <h4>Pedido ID: {pedido.id}</h4>
            {/*<p>Data de Pedido: {format(new Date(pedido.dataDePedido), 'dd/MM/yyyy')}</p>*/}
            <p>Valor do Pedido: R$ {pedido.valorPedido}</p>
            <ul>
                {pedido.ofertaRelacionada.map((oferta, index) => (
                    <li key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                        {oferta.produtoRelacionado.imagens && oferta.produtoRelacionado.imagens.length > 0 && (
                            <img src={oferta.produtoRelacionado.imagens[0]} alt={oferta.produtoRelacionado.nomeProduto} style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                        )}
                        <div>
                            <p>{oferta.produtoRelacionado.nomeProduto}</p>
                            <p><strong>Descrição:</strong> {oferta.descricao}</p>
                            <p><strong>Preço Especial:</strong> {oferta.precoEspecial}</p>
                            <p><strong>Quantidade mínima:</strong> {oferta.quantidadeMinima}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </li>
    ));
    

    return (
        <Container>
            <h1 className="text-center">Pedidos Efetuados</h1>
            <Row>
                <Col xs={12} md={2}>
                </Col>
                <Col xs={12} md={6}>
                {listaPedidosLI}
                </Col>
                <Col xs={12} md={4}>
                    
                </Col>
            </Row>
            
        </Container>
    );
};

export default GerenciarPedidos;
