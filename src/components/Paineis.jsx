import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { getPedidos, getProdutos, getOfertas } from '../auth/firebaseService';
import { format } from 'date-fns';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Paineis = (props) => {
    const [listaPedidos, setListaPedidos] = useState([]);
    const [listaProdutos, setListaProdutos] = useState([]);
    const [listaOfertas, setListaOfertas] = useState([]);
    const [componenteAtual, setComponenteAtual] = useState('produtos');
    const [tipoGrafico, setTipoGrafico] = useState('bar'); // 'bar', 'line', 'pie', 'area'
    const [metricaAtual, setMetricaAtual] = useState('quantidadeEstoque'); // 'vendas', 'estoque', etc.


    useEffect(() => {
        const fetchProdutos = async () => {
            const produtos = await getProdutos();
            const produtosComData = produtos.map(produto => {
                if (produto.dataCriacao && produto.dataCriacao.seconds) {
                    produto.dataCriacao = new Date(produto.dataCriacao.seconds * 1000);
                } else {
                    produto.dataCriacao = new Date(produto.dataCriacao);
                }
                return produto;
            });
            const produtosOrdenados = produtosComData.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
            setListaProdutos(produtosOrdenados);
        };

        const fetchOfertas = async () => {
            const ofertas = await getOfertas();
            const ofertasComData = ofertas.map(oferta => {
                if (oferta.dataCriacao && oferta.dataCriacao.seconds) {
                    oferta.dataCriacao = new Date(oferta.dataCriacao.seconds * 1000);
                } else {
                    oferta.dataCriacao = new Date(oferta.dataCriacao);
                }
                return oferta;
            });
            const ofertasOrdenadas = ofertas.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
            setListaOfertas(ofertasOrdenadas);
        };

        fetchProdutos();
        fetchOfertas();
        const fetchPedidos = async () => {
            const pedidos = await getPedidos();
            setListaPedidos(pedidos);
        };
        fetchPedidos();
    }, []);

    const formatarData = (timestamp) => {
        const milissegundos = timestamp.seconds * 1000 + Math.round(timestamp.nanoseconds / 1000000);
        const data = new Date(milissegundos);
        return format(data, 'dd/MM/yyyy');
    };

    const listaPedidosLI = listaPedidos.map((pedido) => (
        <li key={pedido.id} style={{ marginBottom: "20px" }}>
            <h4>Pedido ID: {pedido.id}</h4>
            <p>Data de Pedido: {formatarData(pedido.dataDePedido)}</p>
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

    const listaPedidosCard = listaPedidos.map((pedido, index) => (
        <Card key={index} style={{ marginBottom: "20px" }}>
            <Card.Body>
                <Card.Title>Pedido ID: {pedido.id}</Card.Title>
                <Card.Text>
                    <pre>{JSON.stringify(pedido, null, 2)}</pre>
                </Card.Text>
            </Card.Body>
        </Card>
    ));

    const listaProdutosCard = listaProdutos.map((produto, index) => (
        <Card key={index} style={{ marginBottom: "20px" }}>
            <Card.Body>
                <Card.Title>Produto ID: {produto.id}</Card.Title>
                <Card.Text>
                    <pre>{JSON.stringify(produto, null, 2)}</pre>
                </Card.Text>
            </Card.Body>
        </Card>
    ));

    const listaOfertasCard = listaOfertas.map((oferta, index) => (
        <Card key={index} style={{ marginBottom: "20px" }}>
            <Card.Body>
                <Card.Title>Oferta ID: {oferta.id}</Card.Title>
                <Card.Text>
                    <pre>{JSON.stringify(oferta, null, 2)}</pre>
                </Card.Text>
            </Card.Body>
        </Card>
    ));

    const renderGrafico = () => {
        let dados;

        // Check data type and process data accordingly based on componenteAtual
        switch (componenteAtual) {
            case 'produtos':
                
                if (listaProdutos.length > 0 && listaProdutos[0] && typeof listaProdutos[0][metricaAtual] === 'number') {
                    // Numerical data: use the metricaAtual directly and filter out undefined values
                    dados = listaProdutos
                        .filter(produto => produto[metricaAtual] !== undefined)
                        .map(produto => {
                            const data = {
                                nome: produto.nomeProduto,
                                valor: produto[metricaAtual]
                            };
                            console.log("produto.nomeProduto ", produto.nomeProduto);
                            console.log("produto[metricaAtual] ", produto[metricaAtual]);
                            return data;
                        });
                    console.log("dados");
                    console.log(dados);
                } else {
                    // Categorical data: count occurrences of each category
                    const categorias = {};
                    listaProdutos.forEach(produto => {
                        const categoria = produto[metricaAtual];
                        categorias[categoria] = categorias[categoria] ? categorias[categoria] + 1 : 1;
                    });

                    // Convert object to array of {nome, valor} pairs
                    dados = Object.keys(categorias).map(categoria => ({
                        nome: categoria,
                        valor: categorias[categoria]
                    }));
                }
                break;
            case 'ofertas':
                // Check if the metricaAtual exists in the first item of listaOfertas
                if (typeof listaOfertas[0][metricaAtual] === 'number') {
                    // Numerical data: use the metricaAtual directly and filter out undefined values
                    dados = listaOfertas
                        .filter(oferta => oferta[metricaAtual] !== undefined)
                        .map(oferta => ({
                            nome: oferta.descricao,
                            valor: oferta[metricaAtual]
                        }));
                } else {
                    // Categorical data: count occurrences of each category
                    const categorias = {};
                    listaOfertas.forEach(oferta => {
                        const categoria = oferta[metricaAtual];
                        categorias[categoria] = categorias[categoria] ? categorias[categoria] + 1 : 1;
                    });

                    // Convert object to array of {nome, valor} pairs
                    dados = Object.keys(categorias).map(categoria => ({
                        nome: categoria,
                        valor: categorias[categoria]
                    }));
                }
                break;
            case 'pedidos':
                // Check if the metricaAtual exists in the first item of listaPedidos
                if (typeof listaPedidos[0][metricaAtual] === 'number') {
                    // Numerical data: use the metricaAtual directly and filter out undefined values
                    dados = listaPedidos
                        .filter(pedido => pedido[metricaAtual] !== undefined)
                        .map(pedido => ({
                            nome: pedido.id,
                            valor: pedido[metricaAtual]
                        }));
                } else {
                    // Categorical data: count occurrences of each category
                    const categorias = {};
                    listaPedidos.forEach(pedido => {
                        const categoria = pedido[metricaAtual];
                        categorias[categoria] = categorias[categoria] ? categorias[categoria] + 1 : 1;
                    });

                    // Convert object to array of {nome, valor} pairs
                    dados = Object.keys(categorias).map(categoria => ({
                        nome: categoria,
                        valor: categorias[categoria]
                    }));
                }
                break;
            default:
                dados = []; // Default to an empty array if componenteAtual is not recognized
                break;
        }

        console.log("dados");
        console.log(dados);

        switch (tipoGrafico) {
            case 'bar':
                return (
                    <BarChart data={dados}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="valor" fill="#8884d8" />
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={dados}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="valor" stroke="#8884d8" />
                    </LineChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie data={dados} dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
                        <Tooltip />
                        <Legend />
                    </PieChart>
                );
            case 'area':
                return (
                    <AreaChart data={dados}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="valor" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                );
            default:
                return null;
        }
    };


    return (
        <Container>
            <h1 className="text-center">Painel de Informações</h1>
            <Row>
            <Col xs={12} md={5}>
                    <ButtonGroup aria-label="Basic example" className="mb-3">
                        <Button variant="warning" onClick={() => props.handlePage("home-fornecedor")} >Voltar</Button>
                       
                    </ButtonGroup>

                </Col>
                <Col xs={12} md={6}>
                    <ButtonGroup aria-label="Basic example" className="mb-3">
                        <Button variant="primary" onClick={() => setComponenteAtual('produtos')} size="lg">Produtos</Button>
                        <Button variant="primary" onClick={() => setComponenteAtual('ofertas')} size="lg">Ofertas</Button>
                        <Button variant="primary" onClick={() => setComponenteAtual('pedidos')} size="lg">Pedidos</Button>
                    </ButtonGroup>

                </Col>
                
            </Row>
            <Row>
                <Col xs={12} md={8}>
                    <ButtonGroup aria-label="Basic example" className="mb-3">
                        <Button variant="info" onClick={() => setMetricaAtual('informacoes')}>Informações</Button>
                        <Button variant="info" onClick={() => setMetricaAtual('quantidadeVendas')}>Vendas</Button>
                        <Button variant="info" onClick={() => setMetricaAtual('quantidadeEstoque')}>Estoque</Button>
                        <Button variant="info" onClick={() => setMetricaAtual('categoria')}>Categoria</Button>

                    </ButtonGroup>
                    {componenteAtual === 'produtos' && (
                        <>
                            {metricaAtual === 'informacoes' && listaProdutosCard}
                            {metricaAtual !== 'informacoes' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    {renderGrafico()}
                                </ResponsiveContainer>
                            )}
                        </>
                    )}
                    {componenteAtual === 'ofertas' && (
                        <>
                            {metricaAtual === 'informacoes' && listaOfertasCard}
                            {metricaAtual === 'vendas' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    {renderGrafico()}
                                </ResponsiveContainer>
                            )}
                        </>
                    )}
                    {componenteAtual === 'pedidos' && (
                        <>
                            {metricaAtual === 'informacoes' && listaPedidosCard}
                            {metricaAtual === 'vendas' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    {renderGrafico()}
                                </ResponsiveContainer>
                            )}
                        </>
                    )}
                </Col>
                <Col xs={12} md={4}>
                    <div className="d-flex flex-column align-items-end">
                        <ButtonGroup vertical aria-label="Vertical button group">
                            <Button variant="secondary" onClick={() => setTipoGrafico('bar')}>Barra</Button>
                            <Button variant="secondary" onClick={() => setTipoGrafico('line')}>Linha</Button>
                            <Button variant="secondary" onClick={() => setTipoGrafico('pie')}>Pizza</Button>
                            <Button variant="secondary" onClick={() => setTipoGrafico('area')}>Área</Button>
                        </ButtonGroup>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Paineis;
