import React from 'react';

const NavegacaoHome = (props) => {

    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => props.handleComponente("posts")}>Posts</button>
            <button onClick={() => props.handleComponente("mensagens")}>Mensagens</button>
            <button onClick={props.handlePage}>Logout</button>
        </div>
    )

}

export default NavegacaoHome