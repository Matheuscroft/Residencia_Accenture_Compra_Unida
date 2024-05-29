import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";

const EsqueciSenha = (props) => {
    const [cnpjMei, setCnpjMei] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmeSenha, setConfirmeSenha] = useState("");
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "cnpjMei") setCnpjMei(value);
        if (name === "novaSenha") setNovaSenha(value);
        if (name === "confirmeSenha") setConfirmeSenha(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newErrors = {};

        if (!cnpjMei) newErrors.cnpjMei = "Este campo é obrigatório";
        if (!novaSenha) newErrors.novaSenha = "Este campo é obrigatório";
        if (!confirmeSenha) newErrors.confirmeSenha = "Este campo é obrigatório";
        if (novaSenha !== confirmeSenha) newErrors.confirmeSenha = "As senhas não coincidem";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            console.log("Senha redefinida com sucesso");
            props.handlePage("login");
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center" style={{ marginTop: '100px' }}>
                <Col xs={12} md={6}>
                    <Card className="text-light" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                        <Card.Body>
                            <h1 className="text-center text-light">Redefinir Senha</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="cnpjMei" className="mb-3">
                                    <Form.Label className="text-light">CNPJ/MEI</Form.Label>
                                    <Form.Control type="text" name="cnpjMei" value={cnpjMei} onChange={handleChange} placeholder="CNPJ/MEI" required />
                                    {errors.cnpjMei && <Alert variant="danger">{errors.cnpjMei}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="novaSenha" className="mb-3">
                                    <Form.Label className="text-light">Nova Senha</Form.Label>
                                    <Form.Control type="password" name="novaSenha" value={novaSenha} onChange={handleChange} placeholder="Nova Senha" required />
                                    {errors.novaSenha && <Alert variant="danger">{errors.novaSenha}</Alert>}
                                </Form.Group>

                                <Form.Group controlId="confirmeSenha" className="mb-3">
                                    <Form.Label className="text-light">Confirme Senha</Form.Label>
                                    <Form.Control type="password" name="confirmeSenha" value={confirmeSenha} onChange={handleChange} placeholder="Confirme Senha" required />
                                    {errors.confirmeSenha && <Alert variant="danger">{errors.confirmeSenha}</Alert>}
                                </Form.Group>

                                <Button type="submit" className="w-100 mt-3" style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black', textDecoration: 'none' }}>
                                    Redefinir Senha
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EsqueciSenha;