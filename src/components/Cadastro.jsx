import React, { useState } from 'react';
import Mensagens from './Mensagens'
import Posts from './Posts'
import NavegacaoHome from './NavegacaoHome';
import NavegacaoHeader from './NavegacaoHeader';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Cadastro = (props) => {

    const [exibeComponente, setExibeComponente] = useState("")

    const handleComponente = (comp) => {
        setExibeComponente(comp)
    }


    switch (exibeComponente) {
        case "mensagens":

            return (
                <div>
                    <NavegacaoHeader />
                    <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage} />
                    <Mensagens />
                </div>
            )

        case "posts":

            return (
                <div>
                    <NavegacaoHeader />
                    <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage} />
                    <Posts />
                </div>
            )

        default:

            return (
                <div>
                    <NavegacaoHeader />
                    <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage} />



                    <Container>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <h1>CADASTRE-SE</h1>
                            </Col>

                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-center" style={{ border: "solid green 2px" }}>
                                <div style={{ border: "solid green 2px" }}>
                                    <button className='botao-cadastrar' onClick={() => props.handlePage("cadastro-cliente")}>Eu Sou Cliente</button>
                                    
                                   
                                </div>
                            </Col>
                            <Col className="d-flex justify-content-center" style={{ border: "solid green 2px" }}>
                                <div style={{ border: "solid blue 2px" }}>
                                    <button className='botao-cadastrar' onClick={() => props.handlePage("cadastro-fornecedor")}>Eu Sou Fornecedor</button>
                                    
                                    
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    
                </div>
            )

            break;
    }

}

export default Cadastro