import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getProdutos, uploadImagem } from "../auth/firebaseService";
import {formatarDataString} from "./Utils"

const EditarProdutoModal = ({ entidade, show, onHide, onSave }) => {
    const [entidadeEditada, setEntidadeEditada] = useState({ ...entidade });
    const [arquivosSelecionados, setArquivosSelecionados] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [quantidadeEstoqueProdutoRelacionado, setQuantidadeEstoqueProdutoRelacionado] = useState(0);


    useEffect(() => {
        if (entidade) {
            setEntidadeEditada({ ...entidade });
            setArquivosSelecionados([]);
        }

        if (entidade && entidade.tipo === "oferta") {
            setQuantidadeEstoqueProdutoRelacionado(entidade.produtoRelacionado.quantidadeEstoque);
        }

        const fetchProdutos = async () => {
            const produtos = await getProdutos();
            setProdutos(produtos);

        };
        fetchProdutos();

    }, [entidade]);

    const handlePriceChange = (event) => {
        let { name, value } = event.target;
        value = value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = "R$ " + value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        setEntidadeEditada({ ...entidadeEditada, [name]: value });
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setArquivosSelecionados(files);
    };

    const handleChange = (event) => {

        let { name, value } = event.target;

        if (name === "quantidadeEstoque") {
            value = parseInt(value, 10); 
            setEntidadeEditada({ ...entidadeEditada, [name]: value });
        }

        if (name === "dataInicio" && entidadeEditada.dataTermino && value > entidadeEditada.dataTermino) {
            setEntidadeEditada({ ...entidadeEditada, [name]: value, dataTermino: "" });
            return
        } else {
            setEntidadeEditada({ ...entidadeEditada, [name]: value });

        }

        if (name === "produtoRelacionado") {
            const produto = produtos.find(p => p.id === value);
            setEntidadeEditada({ ...entidadeEditada, produtoRelacionado: produto });
            /*setQuantidadeEstoqueProdutoRelacionado(produto ? produto.quantidadeEstoque : 0);*/
            return

        } else if (name === "quantidadeMinima") {

            const newValue = value < 0 ? 0 : value; // Garante que o valor mínimo não seja negativo
            setEntidadeEditada({ ...entidadeEditada, [name]: newValue });

        } else {

            setEntidadeEditada({ ...entidadeEditada, [name]: value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let entidadeAtualizada = { ...entidadeEditada };

        if (entidade.tipo === "produto") {

            if (arquivosSelecionados && arquivosSelecionados.length > 0) {

                const imagemUrls = await Promise.all(arquivosSelecionados.map(file => uploadImagem(file)));

                entidadeAtualizada = {
                    ...entidadeAtualizada,
                    imagens: imagemUrls
                };

            } else {

                entidadeAtualizada = {
                    ...entidadeAtualizada,
                    imagens: entidade.imagens,
                };

                
            }
        }
       

        if (entidade.tipo === "oferta" && entidadeEditada.dataTermino && entidadeEditada.dataInicio > entidadeEditada.dataTermino) {
            alert("A data de término deve ser maior que a data de início!");
            return;
        }

        if (entidade.produtoRelacionado && entidade.produtoRelacionado === "default") {
            alert("Selecione um produto");
            return;
        }

        

        onSave(entidadeAtualizada);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{entidade && entidade.tipo === "produto" ? "Editar Produto" : "Editar Oferta"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {entidade && entidade.tipo === "produto" && (
                        <Form.Group controlId="formNomeProduto">
                            <Form.Label>Nome do Produto</Form.Label>
                            <Form.Control
                                type="text"
                                name="nomeProduto"
                                value={entidadeEditada.nomeProduto}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    )}

                    {entidade && entidade.tipo === "oferta" && (
                        <Form.Group controlId="formNomeOferta">
                            <Form.Label>Nome da Oferta</Form.Label>
                            <Form.Control
                                type="text"
                                name="nomeOferta"
                                value={entidadeEditada.nomeOferta}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    )}

                    <Form.Group controlId="formDescricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            name="descricao"
                            value={entidadeEditada.descricao}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {entidade && entidade.tipo === "produto" && (
                        <Form.Group controlId="formCategoria">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control
                                as="select"
                                name="categoria"
                                value={entidadeEditada.categoria}
                                onChange={handleChange}
                            >
                                <option value="alimentacao">Alimentação</option>
                                <option value="vestuario">Vestuário</option>
                                <option value="racao">Ração</option>
                                <option value="bebidas">Bebidas</option>
                            </Form.Control>
                        </Form.Group>
                    )}
                    {entidade && entidade.tipo === "oferta" && (
                        <>
                            <Form.Group controlId="formProdutoRelacionado">
                                <Form.Label>Produto Relacionado</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="produtoRelacionado"
                                    value={entidadeEditada.produtoRelacionado ? entidadeEditada.produtoRelacionado.id : ""}

                                    onChange={handleChange}
                                >
                                    <option value="default">Selecione um produto</option>
                                    {produtos.map(produto => (
                                        <option key={produto.id} value={produto.id} selected={entidadeEditada.produtoRelacionado && entidadeEditada.produtoRelacionado.id === produto.id}>{produto.nomeProduto}</option>
                    ))}          

                                </Form.Control>
                            </Form.Group>

                        </>
                    )}

                    {entidade && entidade.tipo === "produto" && (
                        <Form.Group controlId="formPreco">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control
                                type="text"
                                name="preco"
                                value={entidadeEditada.preco}
                                onChange={handlePriceChange}
                            />
                        </Form.Group>
                    )}

                    {entidade && entidade.tipo === "oferta" && (
                        <Form.Group controlId="formPrecoEspecial">
                            <Form.Label>Preço Especial</Form.Label>
                            <Form.Control
                                type="text"
                                name="precoEspecial"
                                value={entidadeEditada.precoEspecial}
                                onChange={handlePriceChange}
                            />
                        </Form.Group>
                    )}
                    {entidade && entidade.tipo === "produto" && (
                        <Form.Group controlId="formQuantidadeEstoque">
                            <Form.Label>Quantidade em estoque</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantidadeEstoque"
                                value={entidadeEditada.quantidadeEstoque}
                                onChange={handleChange}
                                min="0"
                            />
                        </Form.Group>
                    )}

                    {entidade && entidade.tipo === "oferta" && (
                        <Form.Group controlId="formQuantidadeMinima">
                            <Form.Label>Quantidade mínima para ativação da oferta (Estoque: {quantidadeEstoqueProdutoRelacionado})</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantidadeMinima"
                                value= {entidadeEditada.quantidadeMinima} 
                                onChange={handleChange} 
                                min="0"
                                placeholder="Quantidade mínima para a oferta" 
                                required max={quantidadeEstoqueProdutoRelacionado}
                            />
                        </Form.Group>
                    )}

                    {entidade && entidade.tipo === "produto" && (
                        <Form.Group controlId="formImagens">
                            <Form.Label>Imagens</Form.Label>
                            <Form.Control
                                type="file"
                                name="imagens"
                                onChange={handleFileChange}
                                multiple
                            />
                        </Form.Group>
                    )}

                    {entidade && entidade.tipo === "oferta" && (
                        <>
                            <Form.Group controlId="formDataInicio">
                                <Form.Label>Data de Início da Oferta</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dataInicio"
                                    value={entidadeEditada.dataInicio || ""}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDataTermino">
                                <Form.Label>Data de Término da Oferta</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dataTermino"
                                    value={entidadeEditada.dataTermino || ""}
                                    onChange={handleChange}
                                    disabled={!entidadeEditada.dataInicio}
                                />
                            </Form.Group>
                        </>
                    )}


                    {/* Adicione mais campos de formulário para outros atributos do produto */}
                    <Button variant="primary" type="submit">
                        Salvar Alterações
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditarProdutoModal;
