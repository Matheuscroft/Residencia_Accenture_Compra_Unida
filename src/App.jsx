import React, { useState } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import CadastroFornecedor from './components/CadastroFornecedor';


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


    case "cadastro":

      return (
        <CadastroFornecedor handlePage={handlePage} />
      )


    default:

      return (
        <Login handlePage={handlePage} />
      )
      break;
  }

}

export default App;