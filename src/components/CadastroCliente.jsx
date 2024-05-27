import React, { useState } from "react";
import NavegacaoHeader from "./NavegacaoHeader";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";

const CadastroCliente = (props) => {
    const [dadosCliente, setDadosCliente] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        let value = event.target.value;

        if (name === "telefone") {
            value = formatTelefone(value);
        }

        setDadosCliente({ ...dadosCliente, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const formatTelefone = (value) => {
        value = value.replace(/\D/g, "");
        if (value.length > 0) {
            value = `(${value.substring(0, 2)}) ${value.substring(2, 3)}${value.substring(3, 7)}-${value.substring(7, 11)}`;
        }
        return value;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newErrors = {};

        ['cpf', 'endereco', 'telefone', 'email', 'senha', 'confirma_senha'].forEach(field => {
            if (!dadosCliente[field]) {
                newErrors[field] = 'Este campo é obrigatório';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            alert(`${dadosCliente.nome} cadastrado com sucesso!`);
            props.handlePage("login");
        }
    };

    return (
        <Container>
            <NavegacaoHeader />
            <Row className="justify-content-md-center" style={{ marginTop: '100px' }}>
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Cadastro - Cliente</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="nome" className="mb-3">
                                    <Form.Label className="text-light">Nome Completo/Nome Fantasia</Form.Label>
                                    <Form.Control type="text" name="nome" value={dadosCliente.nome || ""} onChange={handleChange} placeholder="Nome Completo" />
                                </Form.Group>

                                <Form.Group controlId="cpf" className="mb-3">
                                    <Form.Label className="text-light">CPF/CNPJ</Form.Label>
                                    <Form.Control type="text" name="cpf" value={dadosCliente.cpf || ""} onChange={handleChange} placeholder="CPF" required />
                                    {errors.cpf && <Alert variant="danger">{errors.cpf}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="endereco" className="mb-3">
                                    <Form.Label className="text-light">Endereço:</Form.Label>
                                    <Form.Control type="text" name="endereco" value={dadosCliente.endereco || ""} onChange={handleChange} placeholder="Endereço" required />
                                    {errors.endereco && <Alert variant="danger">{errors.endereco}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="telefone" className="mb-3">
                                    <Form.Label className="text-light">Telefone:</Form.Label>
                                    <Form.Control type="text" name="telefone" value={dadosCliente.telefone || ""} onChange={handleChange} placeholder="Telefone" required />
                                    {errors.telefone && <Alert variant="danger">{errors.telefone}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label className="text-light">E-mail:</Form.Label>
                                    <Form.Control type="email" name="email" value={dadosCliente.email || ""} onChange={handleChange} placeholder="E-mail" required />
                                    {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="senha" className="mb-3">
                                    <Form.Label className="text-light">Senha:</Form.Label>
                                    <Form.Control type="password" name="senha" value={dadosCliente.senha || ""} onChange={handleChange} placeholder="Senha" required />
                                    {errors.senha && <Alert variant="danger">{errors.senha}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="confirma_senha" className="mb-3">
                                    <Form.Label className="text-light">Confirma Senha:</Form.Label>
                                    <Form.Control type="password" name="confirma_senha" value={dadosCliente.confirma_senha || ""} onChange={handleChange} placeholder="Confirma Senha" required />
                                    {errors.confirma_senha && <Alert variant="danger">{errors.confirma_senha}</Alert>}
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

export default CadastroCliente;