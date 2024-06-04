import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { getPedidos, getProdutos, getOfertas } from '../auth/firebaseService';
import { format } from 'date-fns';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sortObjectProperties, sortArrayObjectsProperties } from './Utils'

const Paineis = (props) => {
    const [listaPedidos, setListaPedidos] = useState([]);
    const [listaProdutos, setListaProdutos] = useState([]);
    const [listaOfertas, setListaOfertas] = useState([]);
    const [componenteAtual, setComponenteAtual] = useState('produtos');
    const [tipoGrafico, setTipoGrafico] = useState('bar');
    const [metricaAtual, setMetricaAtual] = useState('quantidadeEstoque');


    useEffect(() => {
        const userId = props.userId
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

            const produtosFiltrados = produtosComData.filter(produto => produto.userId === userId);

            const produtosOrdenados = produtosFiltrados.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));

            const produtosComPropsOrdenadas = sortArrayObjectsProperties(produtosOrdenados);
            setListaProdutos(produtosComPropsOrdenadas);
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

            const ofertasFiltradas = ofertasComData.filter(oferta => oferta.userId === userId);

            const ofertasOrdenadas = ofertasFiltradas.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));

            const ofertasComPropsOrdenadas = sortArrayObjectsProperties(ofertasOrdenadas);
            setListaOfertas(ofertasComPropsOrdenadas);
        };

        fetchProdutos();
        fetchOfertas();
        const fetchPedidos = async () => {
            const pedidos = await getPedidos();

            // Filtra pedidos com ofertas relacionadas ao userId do usuário logado
            const pedidosFiltrados = pedidos.filter(pedido => {
                const ofertasFiltradas = pedido.ofertaRelacionada.filter(oferta => oferta.userId === userId);
                if (ofertasFiltradas.length === 0) return false;
                pedido.ofertaRelacionada = ofertasFiltradas;
                return true;
            });

            const pedidosComPropsOrdenadas = sortArrayObjectsProperties(pedidosFiltrados);
            setListaPedidos(pedidosComPropsOrdenadas);
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
        console.log("componenteAtual ", componenteAtual);
        switch (componenteAtual) {
            case 'produtos':

                if (listaProdutos.length > 0 && listaProdutos[0]) {
                    if (metricaAtual === 'preco') {
                        dados = listaProdutos
                            .filter(produto => produto.preco !== undefined)
                            .map(produto => {
                                const precoFloat = parseFloat(produto.preco.replace('R$', '').replace(',', '.'));
                                const data = {
                                    nome: produto.nomeProduto,
                                    valor: precoFloat
                                };

                                console.log("produto.nomeProduto ", produto.nomeProduto);
                                console.log("produto.preco ", precoFloat);
                                return data;
                            });
                        console.log("dados");
                        console.log(dados);
                    } else if (listaProdutos.length > 0 && typeof listaProdutos[0][metricaAtual] === 'number') {

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

                        const categorias = {};
                        listaProdutos.forEach(produto => {
                            const categoria = produto[metricaAtual];
                            categorias[categoria] = categorias[categoria] ? categorias[categoria] + 1 : 1;
                        });


                        dados = Object.keys(categorias).map(categoria => ({
                            nome: categoria,
                            valor: categorias[categoria]
                        }));
                    }
                }
                break;
            case 'ofertas':
                console.log("case ofertas ");

                if (listaOfertas.length > 0 && listaOfertas[0]) {

                    if (metricaAtual === 'preco') {
                        dados = listaOfertas
                            .filter(oferta => oferta.precoEspecial !== undefined)
                            .map(oferta => {
                                const precoFloat = parseFloat(oferta.precoEspecial.replace('R$', '').replace(',', '.'));
                                const data = {
                                    nome: oferta.nomeOferta,
                                    valor: precoFloat
                                };

                                console.log("oferta.nomeOferta ", oferta.nomeOferta);
                                console.log("oferta.precoEspecial ", precoFloat);
                                return data;
                            });
                        console.log("dados de oferta");
                        console.log(dados);
                    } else if (listaOfertas.length > 0 && typeof listaOfertas[0].produtoRelacionado[metricaAtual] === 'number') {

                        dados = listaOfertas
                            .filter(oferta => oferta.produtoRelacionado[metricaAtual] !== undefined)
                            .map(oferta => {
                                const data = {
                                    nome: oferta.nomeOferta,
                                    valor: oferta.produtoRelacionado[metricaAtual]
                                };
                                console.log("oferta.nomeOferta ", oferta.nomeOferta);
                                console.log("oferta[metricaAtual] ", oferta[metricaAtual]);
                                return data;
                            });
                        console.log("dados NUMBER");
                        console.log(dados);
                    } else if (typeof listaOfertas[0][metricaAtual] === 'number') {

                        dados = listaOfertas
                            .filter(oferta => oferta[metricaAtual] !== undefined)
                            .map(oferta => {
                                const data = {
                                    nome: oferta.nomeOferta,
                                    valor: oferta[metricaAtual]
                                };
                                console.log("oferta.nomeOferta ", oferta.nomeOferta);
                                console.log("oferta[metricaAtual] ", oferta[metricaAtual]);
                                return data;
                            });
                        console.log("dados NUMBER oferta");
                        console.log(dados);
                    } else if (metricaAtual === "categoria") {
                        console.log("CAIU NO ELSE ");
                        console.log(listaOfertas[0]);
                        const categorias = {};
                        listaOfertas.forEach(oferta => {
                            if (oferta.produtoRelacionado && oferta.produtoRelacionado.categoria) {
                                const categoria = oferta.produtoRelacionado.categoria;
                                categorias[categoria] = categorias[categoria] ? categorias[categoria] + 1 : 1;
                            }
                        });

                        dados = Object.keys(categorias).map(categoria => ({
                            nome: categoria,
                            valor: categorias[categoria]
                        }));
                    } else {
                        console.log("CAIU NO ELSE ");
                        console.log(listaOfertas[0]);
                        const situacao = {};
                        listaOfertas.forEach(oferta => {
                            if (oferta && oferta.status) {
                                const categoria = oferta.status;
                                situacao[categoria] = situacao[categoria] ? situacao[categoria] + 1 : 1;
                            }
                        });

                        dados = Object.keys(situacao).map(status => ({
                            nome: status,
                            valor: situacao[status]
                        }));

                        console.log("dados else ");
                        console.log(dados);
                    }
                }
                break;


            case 'pedidos':

                if (listaPedidos.length > 0 && listaPedidos[0]) {

                    if (metricaAtual === 'valorPedido') {

                        dados = listaPedidos
                            .filter(pedido => pedido[metricaAtual] !== undefined)
                            .map(pedido => {
                                const data = {
                                    nome: pedido.id,
                                    valor: pedido[metricaAtual]
                                };

                                return data;
                            });

                    } else {
                        const categorias = {};

                        listaPedidos.forEach(pedido => {

                            if (pedido.ofertaRelacionada && Array.isArray(pedido.ofertaRelacionada)) {
                                pedido.ofertaRelacionada.forEach(oferta => {

                                    if (oferta.produtoRelacionado && oferta.produtoRelacionado.categoria) {
                                        const categoria = oferta.produtoRelacionado.categoria;
                                        categorias[categoria] = categorias[categoria] ? categorias[categoria] + 1 : 1;
                                    }
                                });
                            }
                        });

                        dados = Object.keys(categorias).map(categoria => ({
                            nome: categoria,
                            valor: categorias[categoria]
                        }));
                    }
                }
                break;
            default:
                dados = [];
                break;
        }

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
                        <Button variant="warning" onClick={() => props.handlePage("home-fornecedor", { userId: props.userId })} >Voltar</Button>

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
                        <Button variant="info" onClick={() => setMetricaAtual('categoria')}>Categoria</Button>
                        {componenteAtual !== 'pedidos' && (
                            <>
                                <Button variant="info" onClick={() => setMetricaAtual('quantidadeVendas')}>Vendas</Button>
                                <Button variant="info" onClick={() => setMetricaAtual('quantidadeEstoque')}>Estoque</Button>
                                <Button variant="info" onClick={() => setMetricaAtual('preco')}>{componenteAtual === 'ofertas' ? 'Preço Especial' : 'Preço'}</Button>
                            </>
                        )}


                        {componenteAtual === 'ofertas' && (
                            <>
                                <Button variant="info" onClick={() => setMetricaAtual('quantidadeMinima')}>
                                    Quantidade mínima
                                </Button>
                                <Button variant="info" onClick={() => setMetricaAtual('status')}>
                                    Status
                                </Button>
                            </>
                        )}
                        {componenteAtual === 'pedidos' && (

                            <Button variant="info" onClick={() => setMetricaAtual('valorPedido')}>
                                Valor do Pedido
                            </Button>

                        )}
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
                            {metricaAtual !== 'informacoes' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    {renderGrafico()}
                                </ResponsiveContainer>
                            )}
                        </>
                    )}
                    {componenteAtual === 'pedidos' && (
                        <>
                            {metricaAtual === 'informacoes' && listaPedidosCard}
                            {metricaAtual !== 'informacoes' && (
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
        </Container >
    );
};

export default Paineis;
