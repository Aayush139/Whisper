import { useContext, useState, useEffect } from 'react';

import { Box, styled } from '@mui/material';

import { UserContext } from '../../../context/UserProvider';
import { AccountContext } from '../../../context/AccountProvider';

import { getConversation } from '../../../service/api';

import ChatHeader from './ChatHeader';
import Messages from './Messages';


const Component = styled(Box)`
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
`;


const HeaderWrapper = styled(Box)`
    flex-shrink: 0;
`;


const ChatBox = () => {

    const { person } = useContext(UserContext);

    const { account } = useContext(AccountContext);

    const [conversation, setConversation] = useState({});


    useEffect(() => {

        const getConversationDetails = async () => {

            const data = await getConversation({
                senderId: account.sub,
                receiverId: person.sub
            });

            setConversation(data);
        };

        getConversationDetails();

    }, [person.sub]);


    return (

        <Component>

            <HeaderWrapper>
                <ChatHeader person={person} />
            </HeaderWrapper>

            <Messages
                person={person}
                conversation={conversation}
            />

        </Component>
    );
};


export default ChatBox;