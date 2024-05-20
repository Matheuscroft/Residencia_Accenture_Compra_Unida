import React, { useState } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import CadastroFornecedor from './components/CadastroFornecedor';
import HomeFornecedor from './components/HomeFornecedor';
import CriarProduto from './components/CriarProduto'
import CriarOferta from './components/CriarOferta';
import Cadastro from './components/Cadastro';
import CadastroCliente from './components/CadastroCliente'
import HomeCliente from './components/HomeCliente';


function App() {

  const [exibeTela, setExibeTela] = useState("")

  const handlePage = (comp) => {
    setExibeTela(comp)
  }

  switch (exibeTela) {
    case "home":

      return (
        <Home handlePage={handlePage} />
      )

    case "home-cliente":

      return (
        <HomeCliente handlePage={handlePage} />
      )

    case "home-fornecedor":

      return (
        <HomeFornecedor handlePage={handlePage} />
      )

    case "criar-produto":

      return (
        <CriarProduto handlePage={handlePage} />
      )

    case "criar-oferta":

      return (
        <CriarOferta handlePage={handlePage} />
      )

    case "cadastro":

      return (
        <Cadastro handlePage={handlePage} />
      )

    case "cadastro-cliente":

      return (
        <CadastroCliente handlePage={handlePage} />
      )

    case "cadastro-fornecedor":

      return (
        <CadastroFornecedor handlePage={handlePage} />
      )



    default:

      return (
        <Login handlePage={handlePage} />
      )
  }

}

export default App;