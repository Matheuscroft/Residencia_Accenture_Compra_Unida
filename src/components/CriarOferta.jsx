import React, { useState, useEffect } from "react";
import NavegacaoHeader from "./NavegacaoHeader";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

const CriarOferta = (props) => {
    const [oferta, setOferta] = useState({});
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        const produtosStorage = localStorage.getItem('produtos');
        if (produtosStorage) {
            const produtosConvertidos = JSON.parse(produtosStorage);
            setProdutos(listaAnterior => {
                const novosProdutos = produtosConvertidos.filter(novoProd =>
                    !listaAnterior.some(prod => prod.nomeProduto === novoProd.nomeProduto));
                return [...listaAnterior, ...novosProdutos];
            });
        }
    }, []);

    const produtosSelect = produtos.map((produto, index) => (
        <option value={produto.id} key={index}>{produto.nomeProduto}</option>
    ));

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === "dataInicio" && oferta.dataTermino && value > oferta.dataTermino) {
            setOferta({ ...oferta, [name]: value, dataTermino: "" });
        } else {
            setOferta({ ...oferta, [name]: value });
        }
    };

    const handlePriceChange = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = "R$ " + value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        setOferta({ ...oferta, precoEspecial: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (oferta.produtoRelacionado === "default") {
            alert("Selecione um produto");
            return;
        }

        if (oferta.dataTermino && oferta.dataInicio && oferta.dataTermino < oferta.dataInicio) {
            alert("A data de término não pode ser inferior à data de início.");
            return;
        }

        const produtoSelecionado = produtos.find(produto => produto.id === oferta.produtoRelacionado);
        if (!produtoSelecionado) {
            alert("Produto não encontrado");
            return;
        }

        const ofertaComId = {
            id: uuidv4(),
            ...oferta,
            produtoRelacionado: produtoSelecionado
        };

        const ofertasAtuais = JSON.parse(localStorage.getItem('ofertas')) || [];
        const novasOfertas = [...ofertasAtuais, ofertaComId];
        localStorage.setItem('ofertas', JSON.stringify(novasOfertas));

        alert(`${ofertaComId.nomeOferta} cadastrado com sucesso`);
        props.handlePage("home-fornecedor");
    };

    return (
        <Container>
            <NavegacaoHeader />
            <Row className="justify-content-md-center" style={{ marginTop: '100px' }}>
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Cadastrar nova oferta</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="nomeOferta" className="mb-3">
                                    <Form.Label className="text-light">Nome da oferta</Form.Label>
                                    <Form.Control type="text" name="nomeOferta" value={oferta.nomeOferta || ""} onChange={handleChange} placeholder="Nome da oferta" required />
                                </Form.Group>

                                <Form.Group controlId="descricao" className="mb-3">
                                    <Form.Label className="text-light">Descrição</Form.Label>
                                    <Form.Control type="text" name="descricao" value={oferta.descricao || ""} onChange={handleChange} placeholder="Descrição da oferta" required />
                                </Form.Group>

                                <Form.Group controlId="produtoRelacionado" className="mb-3">
                                    <Form.Label className="text-light">Produto relacionado</Form.Label>
                                    <Form.Control as="select" name="produtoRelacionado" value={oferta.produtoRelacionado || "default"} onChange={handleChange} required>
                                        <option value="default">Selecione um produto</option>
                                        {produtosSelect}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="precoEspecial" className="mb-3">
                                    <Form.Label className="text-light">Preço especial</Form.Label>
                                    <Form.Control type="text" name="precoEspecial" value={oferta.precoEspecial || ""} onChange={handlePriceChange} placeholder="Preço especial da oferta" required />
                                </Form.Group>

                                <Form.Group controlId="quantidadeMinima" className="mb-3">
                                    <Form.Label className="text-light">Quantidade mínima para ativação da oferta</Form.Label>
                                    <Form.Control type="number" name="quantidadeMinima" value={oferta.quantidadeMinima || ""} onChange={handleChange} placeholder="Quantidade mínima para a oferta" required />
                                </Form.Group>

                                <Form.Group controlId="dataInicio" className="mb-3">
                                    <Form.Label className="text-light">Data de início da oferta</Form.Label>
                                    <Form.Control type="date" name="dataInicio" value={oferta.dataInicio || ""} onChange={handleChange} placeholder="Data de início da oferta" required />
                                </Form.Group>

                                <Form.Group controlId="dataTermino" className="mb-3">
                                    <Form.Label className="text-light">Data de término da oferta</Form.Label>
                                    <Form.Control type="date" name="dataTermino" value={oferta.dataTermino || ""} onChange={handleChange} placeholder="Data de término da oferta" required disabled={!oferta.dataInicio} />
                                </Form.Group>

                                <Button type="submit" className="w-100 mt-3" style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }}>Cadastrar</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CriarOferta;