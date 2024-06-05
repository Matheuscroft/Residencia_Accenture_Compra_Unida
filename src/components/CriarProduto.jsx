import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { addProduto, uploadImagem } from "../auth/firebaseService";
import {formatarDataString} from "./Utils"

const CriarProduto = (props) => {
    const [produto, setProduto] = useState({});
    const [imagens, setImagens] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        let value = event.target.value;
    
        if (name === "quantidadeEstoque") {
            value = parseInt(value, 10);
            
        }

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

        const produtoAtualizado = {
            ...produto,
            preco: produto.preco,
            dataCriacao: formatarDataString(new Date()),
            quantidadeVendas: 0,
            userId: props.userId
        };

        console.log("props.userId")
        console.log(props.userId)

        const imagemUrls = await Promise.all(imagens.map(file => uploadImagem(file)));
        const produtoComImagens = { ...produtoAtualizado, imagens: imagemUrls };

        const id = await addProduto(produtoComImagens);
        if (id) {
            alert(`${produto.nomeProduto} cadastrado com sucesso com ID: ${id}`);
            props.handlePage("home-fornecedor", { userId: props.userId });
        } else {
            alert("Erro ao cadastrar produto");
        }
    };

    return (
        <Container>
            <Row>
                <Col xs={12} md={5}>
                    <Button variant="warning" onClick={() => props.handlePage("home-fornecedor", { userId: props.userId })} >Voltar</Button>
                </Col>
            </Row>
            <Row className="justify-content-md-center" style={{ marginTop: '-35px' }}>
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
                                        <option value="Alimentação">Alimentação</option>
                                        <option value="Vestuário">Vestuário</option>
                                        <option value="Ração">Ração</option>
                                        <option value="Bebidas">Bebidas</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="preco" className="mb-3">
                                    <Form.Label className="text-light">Preço</Form.Label>
                                    <Form.Control type="text" name="preco" value={produto.preco || ""} onChange={handlePriceChange} placeholder="Preço do produto" required />
                                </Form.Group>

                                <Form.Group controlId="quantidadeEstoque" className="mb-3">
                                    <Form.Label className="text-light">Quantidade em estoque</Form.Label>
                                    <Form.Control type="number" name="quantidadeEstoque" value={produto.quantidadeEstoque || ''} onChange={handleChange} placeholder="Quantidade em estoque do produto" required />
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
        </Container>
    );
}

export default CriarProduto;
