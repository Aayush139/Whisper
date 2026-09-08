import { useState } from 'react';

import { Box, styled } from '@mui/material';

import Header from './Header';
import Search from './Search';
import Conversations from './Conversations';

const Component = styled(Box)`
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
`;

const Menu = () => {
    const [text, setText] = useState('');

    return (
        <Component>
            <Header />
            <Search setText={setText} />
            <Conversations text={text} />
        </Component>
    );
};

export default Menu;