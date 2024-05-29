import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [userType, setUserType] = useState("cliente"); // Estado para armazenar o tipo de usuário
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "email") setEmail(value);
        if (name === "senha") setSenha(value);
        if (name === "userType") setUserType(value); 
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newErrors = {};

        if (!email) newErrors.email = "Este campo é obrigatório";
        if (!senha) newErrors.senha = "Este campo é obrigatório";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            if (userType === "fornecedor") {
                props.handlePage("home-fornecedor");
            } else {
                props.handlePage("home-cliente");
            }
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center" style={{ marginTop: '100px' }}>
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Login</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label className="text-light">E-mail</Form.Label>
                                    <Form.Control type="email" name="email" value={email} onChange={handleChange} placeholder="E-mail" required />
                                    {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="senha" className="mb-3">
                                    <Form.Label className="text-light">Senha</Form.Label>
                                    <Form.Control type="password" name="senha" value={senha} onChange={handleChange} placeholder="Senha" required />
                                    {errors.senha && <Alert variant="danger">{errors.senha}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="userType" className="mb-3">
                                    <Form.Label className="text-light">Tipo de Usuário</Form.Label>
                                    <Form.Control as="select" name="userType" value={userType} onChange={handleChange} required>
                                        <option value="cliente">Cliente</option>
                                        <option value="fornecedor">Fornecedor</option>
                                    </Form.Control>
                                </Form.Group>

                                <Button type="submit" className="w-100 mt-3" style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }}>Entrar</Button>
                            </Form>
                            <Form.Text className="text-light text-center mt-3">
                                <a href="EsqueciSenha" onClick={() => props.handlePage("esqueci-senha")} style={{ color: '#FFCD46' }}>Esqueci minha senha</a>
                            </Form.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;
