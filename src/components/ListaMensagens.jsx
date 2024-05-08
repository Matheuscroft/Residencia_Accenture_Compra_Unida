import React from "react";

const ListaMensagens = (props) => {


    const listMensagens = props.mensagens.map((mensagem) => {
        return (
            <li>{mensagem}</li>
        )
    })

    return (
        <div>
            <p>Você tem {props.mensagens.length} novas mensagens.</p>
            {listMensagens}
        </div>
    )
}

export default ListaMensagens