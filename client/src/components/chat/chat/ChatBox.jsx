
import { useContext, useState, useEffect } from 'react';
import { Box, styled } from '@mui/material';

import { UserContext } from '../../../context/UserProvider';
import { AccountContext } from '../../../context/AccountProvider';
import { getConversation } from '../../../service/api';

import ChatHeader from './ChatHeader';
import Messages from './Messages';

const Component = styled(Box)`
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #080808;

    @media (max-width: 600px) {
        height: 100%;
        width: 100%;
        min-height: 0;
    }
`;

const HeaderWrapper = styled(Box)`
    width: 100%;
    min-width: 0;
    flex-shrink: 0;
`;

const ChatBox = () => {
    const { person } = useContext(UserContext);
    const { account } = useContext(AccountContext);
    const [conversation, setConversation] = useState({});

    useEffect(() => {
        let cancelled = false;

        const getConversationDetails = async () => {
            if (!account?.sub || !person?.sub) {
                setConversation({});
                return;
            }

            try {
                const data = await getConversation({
                    senderId: account.sub,
                    receiverId: person.sub
                });

                if (!cancelled) {
                    setConversation(data || {});
                }
            } catch (error) {
                console.error('Failed to load conversation:', error);

                if (!cancelled) {
                    setConversation({});
                }
            }
        };

        getConversationDetails();

        return () => {
            cancelled = true;
        };
    }, [account?.sub, person?.sub]);

    if (!person?.sub) {
        return null;
    }

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
