import { useState, useEffect, useContext, useRef } from 'react';

import { Box, styled } from '@mui/material';

import { getMessages, newMessages } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';

import Message from './Message';
import Footer from './Footer';


const Wrapper = styled(Box)`
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: #080808;;
`;

const Component = styled(Box)`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    background: #080808;
`;

const Container = styled(Box)`
    padding: 1px 80px;
`;


const Messages = ({ person, conversation }) => {

    const [messages, setMessages] = useState([]);
    const [incomingMessage, setIncomingMessage] = useState(null);
    const [value, setValue] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState();

    const scrollRef = useRef();

    const {
        account,
        socket,
        newMessageFlag,
        setNewMessageFlag
    } = useContext(AccountContext);


    useEffect(() => {
        socket.current.on('getMessage', data => {
            setIncomingMessage({
                ...data,
                createdAt: Date.now()
            });
        });
    }, []);


    useEffect(() => {
        const loadMessages = async () => {
            const data = await getMessages(conversation?._id);
            setMessages(data);
        };

        loadMessages();
    }, [conversation?._id, person._id, newMessageFlag]);


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    useEffect(() => {
        if (
            incomingMessage &&
            conversation?.members?.includes(incomingMessage.senderId)
        ) {
            setMessages(prev => [...prev, incomingMessage]);
        }
    }, [incomingMessage, conversation]);


    const sendText = async (e) => {

        if ((e.keyCode || e.which) !== 13 || !value) return;

        const receiverId = conversation?.members?.find(
            member => member !== account.sub
        );

        const message = {
            senderId: account.sub,
            receiverId,
            conversationId: conversation._id,
            type: file ? 'file' : 'text',
            text: file ? image : value
        };

        socket.current.emit('sendMessage', message);
        await newMessages(message);

        setValue('');
        setFile();
        setImage('');
        setNewMessageFlag(prev => !prev);
    };


    return (
        <Wrapper>

            <Component>
                {messages.map((message, index) => (
                    <Container
                        key={message._id || index}
                        ref={scrollRef}
                    >
                        <Message message={message} />
                    </Container>
                ))}
            </Component>

            <Footer
                sendText={sendText}
                value={value}
                setValue={setValue}
                setFile={setFile}
                file={file}
                setImage={setImage}
            />

        </Wrapper>
    );
};


export default Messages;