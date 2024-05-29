import React from "react";
import ListaMensagens from "./ListaMensagens";

const Mensagens = (props) => {

    const mensagens = [
        "Mensagem 1", "Mensagem 2", "Mensagem 3"
    ]
   
    return (
        <div>
            <h1>Mensagens</h1>
            {mensagens.length ? <ListaMensagens mensagens={mensagens}/> : <p>Ainda não possui mensagens</p>}
        </div>
    )
}

export default Mensagens