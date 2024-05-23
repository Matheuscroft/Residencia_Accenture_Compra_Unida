import React, { useState, useEffect } from 'react';
import { getOfertas } from "../auth/firebaseService"; // Adicione a função para obter ofertas

const Posts = () => {
    const [ofertas, setOfertas] = useState([]);

    useEffect(() => {
        const fetchOfertas = async () => {
            const ofertas = await getOfertas();
            setOfertas(ofertas);
        };
        fetchOfertas();
    }, []);

    const listOfertas = ofertas.map((oferta, index) => (
        <li key={index}>{oferta.nomeOferta}</li>
    ));

    return (
        <div>
            <h1>Ofertas</h1>
            {ofertas.length ? listOfertas : <p>Ainda não possui ofertas</p>}
        </div>
    );
};

export default Posts;

