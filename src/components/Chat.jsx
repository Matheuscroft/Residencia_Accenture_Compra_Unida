import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { getMessages, sendMessage } from '../auth/firebaseService';

const Chat = ({ fornecedorId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (fornecedorId) {
            const fetchMessages = async () => {
                const msgs = await getMessages(fornecedorId);
                setMessages(msgs);
            };
            fetchMessages();
        }
    }, [fornecedorId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            await sendMessage(fornecedorId, newMessage);
            setNewMessage('');
            const msgs = await getMessages(fornecedorId);
            setMessages(msgs);
        }
    };

    return (
        <div>
            <h5>Chat com o Fornecedor</h5>
            <ListGroup>
                {messages.map((msg, index) => (
                    <ListGroup.Item key={index}>{msg.text}</ListGroup.Item>
                ))}
            </ListGroup>
            <Form.Group>
                <Form.Control
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem"
                />
            </Form.Group>
            <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
    );
};

export default Chat;

