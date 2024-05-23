import React from "react";
import NavegacaoHeader from "./NavegacaoHeader";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import EsqueciSenha from "./EsqueciSenha";

const Login = (props) => {
    return (
        <Container>
            <NavegacaoHeader handlePage={props.handlePage} />
            <Row className="justify-content-md-center" style={{ marginTop: '100px' }}>
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Login</h1>
                            <Form>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label className="text-light">E-mail</Form.Label>
                                    <Form.Control type="text" placeholder="Insira seu e-mail" required />
                                </Form.Group>

                                <Form.Group controlId="senha" className="mb-3">
                                    <Form.Label className="text-light">Senha</Form.Label>
                                    <Form.Control type="password" placeholder="Insira sua senha" required />
                                </Form.Group>

                                <EsqueciSenha />
                                <Button className="w-100 mt-3" style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => props.handlePage("home")}>Fazer login</Button>
                                <Button className="w-100 mt-2" style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => props.handlePage("cadastro")}>Cadastre-se</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;
