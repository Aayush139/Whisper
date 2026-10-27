
import { useState, useEffect, useContext, useRef } from 'react';
import { Box, styled } from '@mui/material';
import { getMessages, newMessages } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';
import Message from './Message';
import Footer from './Footer';

const Wrapper = styled(Box)`
    flex: 1;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #080808;
`;

const Component = styled(Box)`
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    background: #080808;
`;

const Container = styled(Box)`
    padding: 4px 80px;
    min-width: 0;
    box-sizing: border-box;

    @media (max-width: 900px) {
        padding: 4px 24px;
    }

    @media (max-width: 700px) {
        padding: 4px 12px;
    }

    @media (max-width: 380px) {
        padding: 3px 8px;
    }
`;

const Messages = ({ person, conversation }) => {
    const [messages, setMessages] = useState([]);
    const [incomingMessage, setIncomingMessage] = useState(null);
    const [value, setValue] = useState('');
    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const scrollRef = useRef(null);

    const { account, socket, newMessageFlag, setNewMessageFlag } =
        useContext(AccountContext);

    useEffect(() => {
        const currentSocket = socket.current;
        if (!currentSocket) return;

        const handleMessage = data => setIncomingMessage({
            ...data, createdAt: Date.now()
        });

        currentSocket.on('getMessage', handleMessage);
        return () => currentSocket.off('getMessage', handleMessage);
    }, [socket]);

    useEffect(() => {
        let cancelled = false;

        const loadMessages = async () => {
            if (!conversation?._id) {
                setMessages([]);
                return;
            }

            try {
                const data = await getMessages(conversation._id);
                if (!cancelled) setMessages(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };

        loadMessages();
        return () => { cancelled = true; };
    }, [conversation?._id, person?._id, newMessageFlag]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: 'smooth', block: 'end'
        });
    }, [messages]);

    useEffect(() => {
        if (!incomingMessage || !conversation?.members) return;

        const belongs = conversation.members.includes(incomingMessage.senderId) &&
            conversation.members.includes(incomingMessage.receiverId);

        if (belongs) {
            setMessages(prev => {
                if (incomingMessage._id &&
                    prev.some(msg => msg._id === incomingMessage._id)) return prev;
                return [...prev, incomingMessage];
            });
        }
    }, [incomingMessage, conversation]);

    const sendText = async e => {
        if ((e.keyCode || e.which) !== 13 || e.shiftKey) return;
        e.preventDefault();

        const text = value.trim();
        if ((!text && !file) || !account?.sub || !conversation?._id) return;

        const receiverId = conversation.members?.find(id => id !== account.sub);
        if (!receiverId) return;

        const message = {
            senderId: account.sub,
            receiverId,
            conversationId: conversation._id,
            type: file ? 'file' : 'text',
            text: file ? image : text
        };

        try {
            await newMessages(message);
            socket.current?.emit('sendMessage', message);
            setValue('');
            setFile(undefined);
            setImage('');
            setNewMessageFlag(prev => !prev);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <Wrapper>
            <Component>
                {messages.map((message, index) => (
                    <Container
                        key={message._id || index}
                        ref={index === messages.length - 1 ? scrollRef : null}
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
                person={person}
            />
        </Wrapper>
    );
};

export default Messages;
