import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { addOferta, getProdutos } from "../auth/firebaseService";
import { todayWithoutTimezone, formatarDataString } from "./Utils.js";

const CriarOferta = (props) => {
    const [oferta, setOferta] = useState({});
    const [produtos, setProdutos] = useState([]);
    const [quantidadeEstoque, setQuantidadeEstoque] = useState(0);

    useEffect(() => {

        const fetchProdutos = async () => {
            const produtos = await getProdutos();

            const produtosFiltrados = produtos.filter(produto => produto.userId === props.userId);
            setProdutos(produtosFiltrados);
        };
        fetchProdutos();
    }, []);

    const produtosSelect = produtos.map((produto) => (
        <option value={produto.id} key={produto.id}>{produto.nomeProduto}</option>
    ));

    const handleChange = (event) => {
        const name = event.target.name;
        let value = event.target.value;

        if (name === "dataInicio" && oferta.dataTermino && value > oferta.dataTermino) {
            setOferta({ ...oferta, [name]: value, dataTermino: "" });
        } else {
            setOferta({ ...oferta, [name]: value });
        }

        if (name === "quantidadeMinima") {
            value = parseInt(value, 10);

        }

        if (name === "produtoRelacionado") {
            const produtoSelecionado = produtos.find(produto => produto.id === value);
            setOferta({ ...oferta, [name]: value });
            setQuantidadeEstoque(produtoSelecionado ? produtoSelecionado.quantidadeEstoque : 0);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const hoje = new Date();


        if (oferta.dataInicio <= hoje) {
            alert("A data de início não pode ser anterior à data atual.");
            return;
        }

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

        // Função para formatar a data no formato desejado
        const formatarDataString = (date, horas = "00", minutos = "00", segundos = "00") => {
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
        };

        const ofertaComProdutoEQntVendas = {
            ...oferta,
            produtoRelacionado: produtoSelecionado,
            quantidadeVendas: 0,
            dataTermino: oferta.dataTermino ? formatarDataString(new Date(oferta.dataTermino), "23", "59", "00") : null,
            dataInicio: oferta.dataInicio ? formatarDataString(new Date(oferta.dataInicio), "00", "00", "00") : null,
            dataCriacao: formatarDataString(new Date()),
            userId: props.userId
        };

        console.log("ofertaComProdutoEQntVendas")
        console.log(ofertaComProdutoEQntVendas)



        const id = await addOferta(ofertaComProdutoEQntVendas);
        if (id) {
            alert(`${oferta.nomeOferta} cadastrada com sucesso com ID: ${id}`);
            props.handlePage("home-fornecedor", { userId: props.userId });
        } else {
            alert("Erro ao cadastrar oferta");
        }
    };


    return (
        <Container>
            <Row>
                <Col xs={12} md={5}>
                    <Button variant="warning" onClick={() => props.handlePage("home-fornecedor", { userId: props.userId })} >Voltar</Button>
                </Col>
            </Row>
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
                                    <Form.Label className="text-light">Quantidade mínima para ativação da oferta (Estoque: {quantidadeEstoque})</Form.Label>
                                    <Form.Control type="number" name="quantidadeMinima" value={oferta.quantidadeMinima || ""} onChange={handleChange} placeholder="Quantidade mínima para a oferta" required max={quantidadeEstoque} />
                                </Form.Group>

                                <Form.Group controlId="dataInicio" className="mb-3">
                                    <Form.Label className="text-light">Data de início da oferta</Form.Label>
                                    <Form.Control type="date" name="dataInicio" value={oferta.dataInicio || ""} onChange={handleChange} placeholder="Data de início da oferta" required min={todayWithoutTimezone} />
                                </Form.Group>

                                <Form.Group controlId="dataTermino" className="mb-3">
                                    <Form.Label className="text-light">Data de término da oferta</Form.Label>
                                    <Form.Control type="date" name="dataTermino" value={oferta.dataTermino || ""} onChange={handleChange} placeholder="Data de término da oferta" required disabled={!oferta.dataInicio} min={new Date(new Date().toDateString()).toISOString().split("T")[0]} />
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
