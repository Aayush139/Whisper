import { useContext, useEffect, useState } from 'react';

import { styled, Box, Typography } from '@mui/material';

import { UserContext } from '../../../context/UserProvider';
import { AccountContext } from '../../../context/AccountProvider';

import { setConversation, getConversation } from '../../../service/api';
import { emptyProfilePicture } from '../../../constants/data';
import { formatDate } from '../../../utils/common-utils';


const Component = styled(Box)`
    height: 45px;
    display: flex;
    padding: 13px 0;
    cursor: pointer;
    background: #0d0d0f;
    transition: .2s;

    &:hover {
        background: #181012;
        box-shadow: inset 3px 0 #a9444e;
    }
`;


const Image = styled('img')`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    padding: 0 14px;
`;


const Container = styled(Box)`
    display: flex;
    align-items: center;
`;


const Name = styled(Typography)`
    color: #eeeeee;
    font-size: 15px;
    font-weight: 500;
`;


const Timestamp = styled(Typography)`
    font-size: 11px;
    margin-left: auto;
    color: #77777d;
    margin-right: 15px;
`;


const Text = styled(Typography)`
    display: block;
    color: #88888f;
    font-size: 13px;
    margin-top: 3px;
`;


const Conversation = ({ user }) => {

    const url = user.picture || emptyProfilePicture;

    const { setPerson } = useContext(UserContext);
    const { account, newMessageFlag } = useContext(AccountContext);

    const [message, setMessage] = useState({});


    useEffect(() => {

        const getConversationMessage = async () => {

            const data = await getConversation({
                senderId: account.sub,
                receiverId: user.sub
            });

            setMessage({
                text: data?.message,
                timestamp: data?.updatedAt
            });
        };

        getConversationMessage();

    }, [newMessageFlag]);


    const getUser = async () => {

        setPerson(user);

        await setConversation({
            senderId: account.sub,
            receiverId: user.sub
        });

    };


    return (
        <Component onClick={getUser}>

            <Box>
                <Image
                    src={url}
                    alt="display picture"
                />
            </Box>

            <Box style={{ width: '100%' }}>

                <Container>

                    <Name>
                        {user.name}
                    </Name>

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

            </Box>

        </Component>
    );
};


export default Conversation;