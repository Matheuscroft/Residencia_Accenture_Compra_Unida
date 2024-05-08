import React, { useState } from 'react';
import Mensagens from './Mensagens'
import Posts from './Posts'
import NavegacaoHome from './NavegacaoHome';
import NavegacaoHeader from './NavegacaoHeader';

const HomeFornecedor = (props) => {

    const[exibeComponente, setExibeComponente] = useState("")

    const handleComponente = (comp) => {
        setExibeComponente(comp)
    }

    switch (exibeComponente) {
        case "mensagens":
            
            return (
                <div>
                    <NavegacaoHeader />
                    <NavegacaoFornecedor handleComponente={handleComponente} handlePage={props.handlePage}/>
                    <Mensagens/>
                </div>
            )
    
        case "posts":
            
            return (
                <div>
                    <NavegacaoHeader />
                    <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage}/>
                    <Posts/>
                </div>
            )
    
        default:

            return (
                <div>
                    <NavegacaoHeader />
                    <NavegacaoHome handleComponente={handleComponente} handlePage={props.handlePage}/>
                </div>
            )

            break;
    }

}

export default HomeFornecedor