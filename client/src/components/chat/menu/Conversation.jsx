import { useContext, useEffect, useState } from 'react';

import { styled, Box, Typography } from '@mui/material';

import { UserContext } from '../../../context/UserProvider';
import { AccountContext } from '../../../context/AccountProvider';

import { setConversation, getConversation } from '../../../service/api';
import { emptyProfilePicture } from '../../../constants/data';
import { formatDate } from '../../../utils/common-utils';

const Component = styled(Box)`
    width: 100%;
    min-height: 76px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    box-sizing: border-box;
    cursor: pointer;
    background: #0d0d0f;
    border-bottom: 1px solid #241719;
    transition: background 0.2s ease;
    overflow: hidden;

    &:hover {
        background: #181012;
        box-shadow: inset 3px 0 #a9444e;
    }
`;

const AvatarWrapper = styled(Box)`
    flex: 0 0 48px;
    width: 48px;
    height: 48px;
    min-width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 50%;
`;

const Image = styled('img')`
    display: block;
    width: 48px;
    height: 48px;
    min-width: 48px;
    max-width: 48px;
    flex-shrink: 0;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
    padding: 0;
    margin: 0;
`;

const Content = styled(Box)`
    flex: 1 1 auto;
    width: 0;
    min-width: 0;
    overflow: hidden;
`;

const Container = styled(Box)`
    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Name = styled(Typography)`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #eeeeee;
    font-size: 15px;
    font-weight: 500;
`;

const Timestamp = styled(Typography)`
    flex-shrink: 0;
    font-size: 11px;
    color: #77777d;
    white-space: nowrap;
`;

const Text = styled(Typography)`
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #88888f;
    font-size: 13px;
    margin-top: 4px;
`;

const Conversation = ({ user }) => {
    const url = user.picture || emptyProfilePicture;

    const { setPerson } = useContext(UserContext);
    const { account, newMessageFlag } = useContext(AccountContext);

    const [message, setMessage] = useState({});

    useEffect(() => {
        let cancelled = false;

        const getConversationMessage = async () => {
            if (!account?.sub || !user?.sub) return;

            try {
                const data = await getConversation({
                    senderId: account.sub,
                    receiverId: user.sub
                });

                if (!cancelled) {
                    setMessage({
                        text: data?.message,
                        timestamp: data?.updatedAt
                    });
                }
            } catch (error) {
                console.error('Failed to load conversation preview:', error);
            }
        };

        getConversationMessage();

        return () => {
            cancelled = true;
        };
    }, [account?.sub, user?.sub, newMessageFlag]);

    const getUser = async () => {
        setPerson(user);

        try {
            await setConversation({
                senderId: account.sub,
                receiverId: user.sub
            });
        } catch (error) {
            console.error('Failed to set conversation:', error);
        }
    };

    return (
        <Component onClick={getUser}>
            <AvatarWrapper>
                <Image src={url} alt={`${user.name || 'User'} profile`} />
            </AvatarWrapper>

            <Content>
                <Container>
                    <Name title={user.name}>{user.name}</Name>

                    {message?.text && (
                        <Timestamp>
                            {formatDate(message.timestamp)}
                        </Timestamp>
                    )}
                </Container>

                <Text>
                    {message?.text?.includes('/file/')
                        ? 'Media'
                        : message?.text || 'Start a conversation'}
                </Text>
            </Content>
        </Component>
    );
};

export default Conversation;