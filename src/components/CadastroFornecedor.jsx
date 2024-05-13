import React, { useState } from "react";
import NavegacaoHeader from "./NavegacaoHeader";
import { Input, Wrapper, Title, Button, BotaoPrincipal } from "./Estilos";

const CadastroFornecedor = (props) => {

    const [dadosFornecedor, setDadosFornecedor] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        //setDadosFornecedor(values => ({...values, [name]: value}))
        setDadosFornecedor({ ...dadosFornecedor, [name]: value })
        console.log(dadosFornecedor)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`${dadosFornecedor.nome} cadastrado com sucesso!`)
        props.handlePage("home-fornecedor")
        
      }

    return (

        <div>
            <NavegacaoHeader />

            <Wrapper>
                <form onSubmit={handleSubmit} >
                    <Title>Cadastro - Fornecedor</Title>

                    <label>Razão Social:
                        <Input type="text" name="razao_social" value={dadosFornecedor.razao_social || ""}  onChange={handleChange} placeholder="Razão Social" /><br />
                    </label>

                    <p>{dadosFornecedor.razao_social}</p>

                    <label>Nome Completo do Responsável:
                        <Input type="text" name="nome" value={dadosFornecedor.nome || ""}  onChange={handleChange} placeholder="Nome Completo" /><br />
                    </label>

                    <label>CPNJ/MEI: OBRIGATORIO
                        <Input type="text" name="cnpj_mei" value={dadosFornecedor.cnpj_mei || ""}  onChange={handleChange} placeholder="CPF/CPNJ" required /><br />
                    </label>

                    <label>Endereço: OBG
                        <Input type="text" name="endereco" value={dadosFornecedor.endereco || ""}  onChange={handleChange} placeholder="Endereço" required /><br />
                    </label>

                    <label>Telefone: OBG
                        <Input type="text" name="telefone" value={dadosFornecedor.telefone || ""}  onChange={handleChange} placeholder="Telefone" required /><br />
                    </label>

                    <label>E-mail: OBG
                        <Input type="email" name="email" value={dadosFornecedor.email || ""}  onChange={handleChange} placeholder="E-mail" required /><br />
                    </label>

                    <label>Senha: OBG
                        <Input type="password" name="senha" value={dadosFornecedor.senha || ""}  onChange={handleChange} placeholder="Senha" required /><br />
                    </label>

                    <label>Confirma Senha: OBG
                        <Input type="password" name="confirma_senha" value={dadosFornecedor.confirma_senha || ""}  onChange={handleChange} placeholder="Senha" required /><br />
                    </label>

                    <input type="submit" />
                    <Button>Cadastrar</Button>
                    <BotaoPrincipal>MEU NOME</BotaoPrincipal>
                </form>
            </Wrapper>
        </div>
    )
}

export default CadastroFornecedor