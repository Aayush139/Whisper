import { useContext } from 'react';

import { Box, styled } from '@mui/material';

import { AccountContext } from '../context/AccountProvider';

import ChatDialog from './chat/ChatDialog';
import LoginDialog from './account/LoginDialog';


const Component = styled(Box)`
    height: 100vh;
    width: 100vw;
    background: #050505;
    overflow: hidden;
`;


const Messenger = () => {

    const { account } = useContext(AccountContext);

    return (
        <Component>
            {account ? <ChatDialog /> : <LoginDialog />}
        </Component>
    );
};


export default Messenger;