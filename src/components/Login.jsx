import React from "react";
import NavegacaoHeader from "./NavegacaoHeader";
import { Input } from "./Estilos";

const Login = (props) => {
    return (
        <div>
            <NavegacaoHeader />
            <h1>Fazer Login</h1>
            <div>
                <form action="" style={{ display: "flex", flexDirection: "column" }}>
                    
                    <label htmlFor="email">E-mail</label>
                    <Input type="text" id="email" name="email" placeholder="Insira seu e-mail" required />

                    <label htmlFor="senha">Senha</label>
                    <Input type="password" id="senha" name="senha" placeholder="Insira sua senha" required />

                </form>
            </div>
            <a href="">Esqueci minha senha</a>
            <button onClick={() => props.handlePage("home")}>Fazer login</button>
            <button onClick={() => props.handlePage("cadastro")}>Cadastre-se</button>
        </div>
    )
}

export default Login