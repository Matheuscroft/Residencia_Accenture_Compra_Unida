import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { register } from '../auth/firebaseAuth';

const CadastroFornecedor = (props) => {
    const [dadosFornecedor, setDadosFornecedor] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        let value = event.target.value;

        if (name === "telefone") {
            value = formatTelefone(value);
        }

        setDadosFornecedor({ ...dadosFornecedor, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const formatTelefone = (value) => {
        value = value.replace(/\D/g, "");

        if (value.length > 0) {
            value = `(${value.substring(0, 2)}) ${value.substring(2, 3)}${value.substring(3, 7)}-${value.substring(7, 11)}`;
        }

        return value;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};
    
        ['cnpj_mei', 'endereco', 'telefone', 'email', 'senha', 'confirma_senha'].forEach(field => {
            if (!dadosFornecedor[field]) {
                newErrors[field] = 'Este campo é obrigatório';
            }
        });
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            if (dadosFornecedor.senha.length < 6) {
                newErrors['senha'] = 'A senha deve ter no mínimo 6 caracteres';
                setErrors(newErrors);
            } else {
                await register(dadosFornecedor.email, dadosFornecedor.confirma_senha, "fornecedor");
                alert(`${dadosFornecedor.nome} cadastrado com sucesso!`);
                props.handlePage("login");
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center" style={{ marginTop: '50px' }}>
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Cadastro - Fornecedor</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="razao_social" className="mb-3">
                                    <Form.Label className="text-light">Razão Social</Form.Label>
                                    <Form.Control type="text" name="razao_social" value={dadosFornecedor.razao_social || ""} onChange={handleChange} placeholder="Razão Social" />
                                </Form.Group>

                                <Form.Group controlId="nome" className="mb-3">
                                    <Form.Label className="text-light">Nome Completo do Responsável</Form.Label>
                                    <Form.Control type="text" name="nome" value={dadosFornecedor.nome || ""} onChange={handleChange} placeholder="Nome Completo" />
                                </Form.Group>

                                <Form.Group controlId="cnpj_mei" className="mb-3">
                                <Form.Label className="text-light">CNPJ/MEI</Form.Label>
                                    <Form.Control type="text" name="cnpj_mei" value={dadosFornecedor.cnpj_mei || ""} onChange={handleChange} placeholder="CNPJ/MEI" required />
                                    {errors.cnpj_mei && <Alert variant="danger">{errors.cnpj_mei}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="endereco" className="mb-3">
                                    <Form.Label className="text-light">Endereço:</Form.Label>
                                    <Form.Control type="text" name="endereco" value={dadosFornecedor.endereco || ""} onChange={handleChange} placeholder="Endereço" required />
                                    {errors.endereco && <Alert variant="danger">{errors.endereco}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="telefone" className="mb-3">
                                    <Form.Label className="text-light">Telefone:</Form.Label>
                                    <Form.Control type="text" name="telefone" value={dadosFornecedor.telefone || ""} onChange={handleChange} placeholder="Telefone" required />
                                    {errors.telefone && <Alert variant="danger">{errors.telefone}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label className="text-light">E-mail:</Form.Label>
                                    <Form.Control type="email" name="email" value={dadosFornecedor.email || ""} onChange={handleChange} placeholder="E-mail" required />
                                    {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="senha" className="mb-3">
                                    <Form.Label className="text-light">Senha:</Form.Label>
                                    <Form.Control type="password" name="senha" value={dadosFornecedor.senha || ""} onChange={handleChange} placeholder="Senha" required />
                                    {errors.senha && <Alert variant="danger">{errors.senha}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="confirma_senha" className="mb-3">
                                    <Form.Label className="text-light">Confirma Senha:</Form.Label>
                                    <Form.Control type="password" name="confirma_senha" value={dadosFornecedor.confirma_senha || ""} onChange={handleChange} placeholder="Confirma Senha" required />
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

export default CadastroFornecedor;