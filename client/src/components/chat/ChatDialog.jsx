import { useContext } from 'react';

import { Box, styled } from '@mui/material';

import { UserContext } from '../../context/UserProvider';

import Menu from './menu/Menu';
import ChatBox from './chat/ChatBox';
import EmptyChat from './chat/EmptyChat';


const Component = styled(Box)`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 94vw;
    height: 90vh;

    box-sizing: border-box;
    overflow: hidden;

    display: flex;

    background: #0d0d0f;
    border: 1px solid #241014;
    border-radius: 20px;

    box-shadow: 0 20px 70px rgba(0, 0, 0, .8);

    @media (max-width: 700px) {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
        border: none;
    }
`;


const LeftComponent = styled(Box)`
    width: 34%;
    height: 100%;
    background: #0d0d0f;

    @media (max-width: 700px) {
        width: 100%;
        min-width: 0;
    }
`;


const RightComponent = styled(Box)`
    width: 66%;
    height: 100%;
    background: #080808;
    border-left: 1px solid #2a171a;

    @media (max-width: 700px) {
        width: 100%;
        border-left: none;
    }
`;


const ChatDialog = () => {

    const { person } = useContext(UserContext);

    const chatOpen = Object.keys(person).length > 0;

    return (
        <Component>

            <LeftComponent
                sx={{
                    display: chatOpen ? { xs: 'none', md: 'block' } : 'block'
                }}
            >
                <Menu />
            </LeftComponent>

            <RightComponent
                sx={{
                    display: chatOpen ? 'block' : { xs: 'none', md: 'block' }
                }}
            >
                {chatOpen ? <ChatBox /> : <EmptyChat />}
            </RightComponent>

        </Component>
    );
};


export default ChatDialog;