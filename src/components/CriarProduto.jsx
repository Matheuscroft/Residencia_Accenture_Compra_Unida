import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { addProduto, uploadImagem } from "../auth/firebaseService";

const CriarProduto = (props) => {
    const [produto, setProduto] = useState({});
    const [imagens, setImagens] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        let value = event.target.value;
    
        if (name === "quantidadeEstoque" && value < 0) {
            value = 0;
        }
    
        setProduto({ ...produto, [name]: value });
    };

    const handlePriceChange = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = "R$ " + value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        setProduto({ ...produto, preco: value });
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        setImagens(Array.from(files));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (produto.categoria === "default") {
            alert("Selecione uma categoria");
            return;
        }

        const produtoComId = {
            id: uuidv4(),
            ...produto
        };

        const imagemUrls = await Promise.all(imagens.map(file => uploadImagem(file)));
        const produtoComImagens = { ...produtoComId, imagens: imagemUrls };

        const id = await addProduto(produtoComImagens);
        if (id) {
            alert(`${produto.nomeProduto} cadastrado com sucesso com ID: ${id}`);
            props.handlePage("home-fornecedor");
        } else {
            alert("Erro ao cadastrar produto");
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center" style={{ marginTop: '100px' }}>
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Cadastrar novo produto</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="nomeProduto" className="mb-3">
                                    <Form.Label className="text-light">Nome do produto</Form.Label>
                                    <Form.Control type="text" name="nomeProduto" value={produto.nomeProduto || ""} onChange={handleChange} placeholder="Nome do produto" required />
                                </Form.Group>

                                <Form.Group controlId="descricao" className="mb-3">
                                    <Form.Label className="text-light">Descrição</Form.Label>
                                    <Form.Control type="text" name="descricao" value={produto.descricao || ""} onChange={handleChange} placeholder="Descrição do produto" required />
                                </Form.Group>

                                <Form.Group controlId="categoria" className="mb-3">
                                    <Form.Label className="text-light">Categoria</Form.Label>
                                    <Form.Control as="select" name="categoria" value={produto.categoria || "default"} onChange={handleChange} required>
                                        <option value="default">Selecione uma categoria</option>
                                        <option value="alimentacao">Alimentação</option>
                                        <option value="vestuario">Vestuário</option>
                                        <option value="racao">Ração</option>
                                        <option value="bebidas">Bebidas</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="preco" className="mb-3">
                                    <Form.Label className="text-light">Preço</Form.Label>
                                    <Form.Control type="text" name="preco" value={produto.preco || ""} onChange={handlePriceChange} placeholder="Preço do produto" required />
                                </Form.Group>

                                <Form.Group controlId="quantidadeEstoque" className="mb-3">
                                    <Form.Label className="text-light">Quantidade em estoque</Form.Label>
                                    <Form.Control type="number" name="quantidadeEstoque" value={produto.quantidadeEstoque || ""} onChange={handleChange} placeholder="Quantidade em estoque do produto" required />
                                </Form.Group>

                                <Form.Group controlId="imagens" className="mb-3">
                                    <Form.Label className="text-light">Imagens</Form.Label>
                                    <Form.Control type="file" name="imagens" onChange={handleImageChange} multiple />
                                </Form.Group>

                                <Button type="submit" className="w-100 mt-3" style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }}>Cadastrar</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-md-center" style={{ marginTop: '10px' }}>
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda', marginBottom: '10px' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Produto 1</h1>
                            <p>Descrição do Produto 1</p>
                        </Card.Body>
                    </Card>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda', marginBottom: '10px' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Produto 2</h1>
                            <p>Descrição do Produto 2</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CriarProduto;
