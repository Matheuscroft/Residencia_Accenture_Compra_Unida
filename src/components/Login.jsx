import React from "react";
import NavegacaoHeader from "./NavegacaoHeader";

const Login = (props) => {
    return (
        <div>
            <NavegacaoHeader />
            <h1>Login</h1>
            <button onClick={() => props.handlePage("home")}>Fazer login</button>
            <button onClick={() => props.handlePage("cadastro")}>Cadastre-se</button>
        </div>
    )
}

export default Login