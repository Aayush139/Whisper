import { useContext } from 'react';
import { Box, styled } from '@mui/material';

import { UserContext } from '../../context/UserProvider';

import Menu from './menu/Menu';
import ChatBox from './chat/ChatBox';
import EmptyChat from './chat/EmptyChat';

const Component = styled(Box)`
    position: fixed;
    inset: 0;
    display: flex;

    width: 100%;
    height: 100vh;
    height: 100dvh;

    box-sizing: border-box;
    min-width: 0;
    min-height: 0;
    overflow: hidden;

    background: #0d0d0f;
    border: 1px solid #241014;
    border-radius: 20px;
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.8);

    @media (min-width: 701px) {
        width: 94%;
        max-width: 1500px;
        height: 90vh;
        height: 90dvh;
        min-height: 400px;

        inset: 50% auto auto 50%;
        transform: translate(-50%, -50%);
    }

    @media (max-width: 700px) {
        inset: 0;
        width: 100%;
        max-width: 100%;
        height: 100vh;
        height: 100dvh;
        min-height: 0;
        transform: none;

        border: none;
        border-radius: 0;
        box-shadow: none;
    }
`;

const LeftComponent = styled(Box)`
    flex: 0 0 34%;
    width: 34%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
    background: #0d0d0f;

    @media (max-width: 700px) {
        flex: 0 0 100%;
        width: 100%;
        max-width: 100%;
    }
`;

const RightComponent = styled(Box)`
    flex: 1 1 0;
    width: 0;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
    background: #080808;
    border-left: 1px solid #2a171a;

    @media (max-width: 700px) {
        flex: 0 0 100%;
        width: 100%;
        max-width: 100%;
        border-left: none;
    }
`;

const ChatDialog = () => {
    const { person } = useContext(UserContext);

    const chatOpen = Boolean(person && person.sub);

    return (
        <Component>
            <LeftComponent
                sx={{
                    display: {
                        xs: chatOpen ? 'none' : 'block',
                        md: 'block'
                    },
                    '@media (min-width: 701px)': {
                        display: 'block'
                    }
                }}
            >
                <Menu />
            </LeftComponent>

            <RightComponent
                sx={{
                    display: {
                        xs: chatOpen ? 'block' : 'none',
                        md: 'block'
                    },
                    '@media (min-width: 701px)': {
                        display: 'block'
                    }
                }}
            >
                {chatOpen ? <ChatBox /> : <EmptyChat />}
            </RightComponent>
        </Component>
    );
};

export default ChatDialog;