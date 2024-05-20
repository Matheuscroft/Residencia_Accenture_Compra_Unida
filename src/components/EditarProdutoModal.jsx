import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditarProdutoModal = ({ entidade, show, onHide, onEdit }) => {
    const [editedEntidade, setEditedEntidade] = useState({ ...entidade });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [produtos, setProdutos] = useState([]);


    useEffect(() => {
        if (entidade) {
            setEditedEntidade({ ...entidade });
        }

        const storedProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(storedProdutos);

    }, [entidade]);

    const handlePriceChange = (event) => {
        let { name, value } = event.target;
        value = value.replace(/\D/g, "");
        value = (value / 100).toFixed(2) + "";
        value = value.replace(".", ",");
        value = "R$ " + value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        setEditedEntidade({ ...editedEntidade, [name]: value });
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        console.log("name"+ name)
        console.log("value"+ value)
        if (name === "dataInicio" && editedEntidade.dataTermino && value > editedEntidade.dataTermino) {
            setEditedEntidade({ ...editedEntidade, [name]: value, dataTermino: "" });
        } else {
            setEditedEntidade({ ...editedEntidade, [name]: value });
        }

        if (name === "produtoRelacionado") {
            const product = produtos.find(p => p.id === value);
            setEditedEntidade({ ...editedEntidade, produtoRelacionado: product });
        }
        
        setEditedEntidade({ ...editedEntidade, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let updatedEntidade = { ...editedEntidade };

        if (entidade.tipo === "produto") {
            const fileURLs = selectedFiles.map(file => URL.createObjectURL(file));
            updatedEntidade = {
                ...updatedEntidade,
                imagens: fileURLs
            };
        }

        if (entidade.tipo === "oferta" && editedEntidade.dataTermino && editedEntidade.dataInicio > editedEntidade.dataTermino) {
            alert("A data de término deve ser maior que a data de início!");
            return; // Não salva as alterações se a data de término for menor que a data de início
        }

        onEdit(updatedEntidade);
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
                                value={editedEntidade.nomeProduto}
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
                                value={editedEntidade.nomeOferta}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    )}

                    <Form.Group controlId="formDescricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            name="descricao"
                            value={editedEntidade.descricao}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {entidade && entidade.tipo === "produto" && (
                        <Form.Group controlId="formCategoria">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control
                                as="select"
                                name="categoria"
                                value={editedEntidade.categoria}
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
                                    value={editedEntidade.produtoRelacionado ? editedEntidade.produtoRelacionado.id : ""}

                                    onChange={handleChange}
                                >
                                    <option value="default">Selecione um produto</option>
                                    {produtos.map(produto => (
                                        <option key={produto.id} value={produto.id}>{produto.nomeProduto}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            {/* Restante dos campos específicos para oferta */}
                        </>
                    )}

                    {entidade && entidade.tipo === "produto" && (
                        <Form.Group controlId="formPreco">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control
                                type="text"
                                name="preco"
                                value={editedEntidade.preco}
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
                                value={editedEntidade.precoEspecial}
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
                                value={editedEntidade.quantidadeEstoque}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    )}

                    {entidade && entidade.tipo === "oferta" && (
                        <Form.Group controlId="formQuantidadeMinima">
                            <Form.Label>Quantidade mínima para ativação da oferta</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantidadeMinima"
                                value={editedEntidade.quantidadeMinima}
                                onChange={handleChange}
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
                                    value={editedEntidade.dataInicio || ""}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDataTermino">
                                <Form.Label>Data de Término da Oferta</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dataTermino"
                                    value={editedEntidade.dataTermino || ""}
                                    onChange={handleChange}
                                    disabled={!editedEntidade.dataInicio}
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
