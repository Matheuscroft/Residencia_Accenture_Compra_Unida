import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { getPedidos, getProdutos, getOfertas } from '../auth/firebaseService';
import { format } from 'date-fns';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ordenarPropriedadesObjeto, ordenarArrayPropriedadesObjeto, ordenarPorDataString } from './Utils'

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
            const produtosFiltrados = produtos.filter(produto => produto.userId === userId);
            const produtosOrdenados = ordenarPorDataString(produtosFiltrados, 'dataCriacao');
            const produtosComPropsOrdenadas = ordenarArrayPropriedadesObjeto(produtosOrdenados);
            setListaProdutos(produtosComPropsOrdenadas);
        };

        const fetchOfertas = async () => {
            const ofertas = await getOfertas();
            const ofertasFiltradas = ofertas.filter(oferta => oferta.userId === userId);

            const ofertasOrdenadas = ordenarPorDataString(ofertasFiltradas, 'dataCriacao');

            const ofertasComPropsOrdenadas = ordenarArrayPropriedadesObjeto(ofertasOrdenadas);
            setListaOfertas(ofertasComPropsOrdenadas);
        };

        fetchProdutos();
        fetchOfertas();
        const fetchPedidos = async () => {
            const pedidos = await getPedidos();

            // Filtra pedidos com ofertas relacionadas ao userId do usuário logado
            const pedidosFiltrados = pedidos.filter(pedido => {
                const ofertasFiltradas = pedido.ofertasRelacionadas.filter(oferta => oferta.userId === userId);
                if (ofertasFiltradas.length === 0) return false;
                pedido.ofertasRelacionadas = ofertasFiltradas;
                return true;
            });

            const pedidosComPropsOrdenadas = ordenarArrayPropriedadesObjeto(pedidosFiltrados);
            setListaPedidos(pedidosComPropsOrdenadas);
        };
        fetchPedidos();
    }, []);



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
                                    Valor: precoFloat
                                };
                            
                                return data;
                            });
                    } else if (metricaAtual === "quantidadeVendas" || metricaAtual === "quantidadeEstoque") {

                        dados = listaProdutos
                            .filter(produto => produto[metricaAtual] !== undefined)
                            .map(produto => {
                                const data = {
                                    nome: produto.nomeProduto,
                                    Quantidade: produto[metricaAtual]
                                };
                                
                                return data;
                            });
                        
                    } else {

                        const categorias = {};
                        listaProdutos.forEach(produto => {
                            const categoria = produto[metricaAtual];
                            categorias[categoria] = categorias[categoria] ? categorias[categoria] + 1 : 1;
                        });


                        dados = Object.keys(categorias).map(categoria => ({
                            nome: categoria,
                            Quantidade: categorias[categoria]
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
                                    Valor: precoFloat
                                };

                                return data;
                            });
                    } else if (metricaAtual === "quantidadeVendas" || metricaAtual === "quantidadeEstoque") {

                        dados = listaOfertas
                            .filter(oferta => oferta.produtoRelacionado[metricaAtual] !== undefined)
                            .map(oferta => {
                                const data = {
                                    nome: oferta.nomeOferta,
                                    Quantidade: oferta.produtoRelacionado[metricaAtual]
                                };
                                return data;
                            });

                    } else if (metricaAtual === "quantidadeMinima") {

                        dados = listaOfertas
                            .filter(oferta => oferta[metricaAtual] !== undefined)
                            .map(oferta => {
                                const data = {
                                    nome: oferta.nomeOferta,
                                    Quantidade: oferta[metricaAtual]
                                };
                                
                                return data;
                            });
                        
                    } else if (metricaAtual === "categoria") {
                        
                        const categorias = {};
                        listaOfertas.forEach(oferta => {
                            if (oferta.produtoRelacionado && oferta.produtoRelacionado.categoria) {
                                const categoria = oferta.produtoRelacionado.categoria;
                                categorias[categoria] = categorias[categoria] ? categorias[categoria] + 1 : 1;
                            }
                        });

                        dados = Object.keys(categorias).map(categoria => ({
                            nome: categoria,
                            Quantidade: categorias[categoria]
                        }));
                    } else {
                        
                        const situacao = {};
                        listaOfertas.forEach(oferta => {
                            if (oferta && oferta.status) {
                                const categoria = oferta.status;
                                situacao[categoria] = situacao[categoria] ? situacao[categoria] + 1 : 1;
                            }
                        });

                        dados = Object.keys(situacao).map(status => ({
                            nome: status,
                            Quantidade: situacao[status]
                        }));

                        
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
                                    Valor: pedido[metricaAtual]
                                };

                                return data;
                            });

                    } else {
                        const categorias = {};

                        listaPedidos.forEach(pedido => {

                            if (pedido.ofertasRelacionadas && Array.isArray(pedido.ofertasRelacionadas)) {
                                pedido.ofertasRelacionadas.forEach(oferta => {

                                    if (oferta.produtoRelacionado && oferta.produtoRelacionado.categoria) {
                                        const categoria = oferta.produtoRelacionado.categoria;
                                        categorias[categoria] = categorias[categoria] ? categorias[categoria] + 1 : 1;
                                    }
                                });
                            }
                        });

                        dados = Object.keys(categorias).map(categoria => ({
                            nome: categoria,
                            Quantidade: categorias[categoria]
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
                        <Bar dataKey={metricaAtual === "preco" || metricaAtual === "valorPedido"  ? "Valor" : "Quantidade"} fill="#8884d8" />
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
                        <Line type="monotone" dataKey={metricaAtual === "preco" || metricaAtual === "valorPedido"  ? "Valor" : "Quantidade"} stroke="#8884d8" />
                    </LineChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie data={dados} dataKey={metricaAtual === "preco" || metricaAtual === "valorPedido"  ? "Valor" : "Quantidade"} nameKey="nome" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
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
                        <Area type="monotone" dataKey={metricaAtual === "preco" || metricaAtual === "valorPedido"  ? "Valor" : "Quantidade"} stroke="#8884d8" fill="#8884d8" />
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
