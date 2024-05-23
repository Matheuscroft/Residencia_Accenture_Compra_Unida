import React from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import NavegacaoHeader from './NavegacaoHeader'; // Importando o componente de cabeçalho

const EsqueciSenha = () => {
    return (
        <Container>
            <NavegacaoHeader /> 
            <Row className="justify-content-md-center" style={{ marginTop: '20px' }}> 
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Esqueci Minha Senha</h1>
                            <Form>
                                <Form.Group controlId="novaSenha" className="mb-3">
                                    <Form.Label className="text-light">Nova Senha</Form.Label>
                                    <Form.Control type="password" placeholder="Insira sua nova senha" required />
                                </Form.Group>

                                <Form.Group controlId="confirmarNovaSenha" className="mb-3">
                                    <Form.Label className="text-light">Confirmar Nova Senha</Form.Label>
                                    <Form.Control type="password" placeholder="Confirme sua nova senha" required />
                                </Form.Group>

                                <Button className="w-100 mt-3" style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }}>Redefinir Senha</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EsqueciSenha;