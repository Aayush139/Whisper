import { useContext } from 'react';

import { Box, Typography, styled } from '@mui/material';
import { Search, MoreVert } from '@mui/icons-material';

import { AccountContext } from '../../../context/AccountProvider';
import { defaultProfilePicture } from '../../../constants/data';


const Header = styled(Box)`
    height: 44px;
    background: #0d0d0f;
    display: flex;
    padding: 8px 16px;
    align-items: center;
    border-bottom: 1px solid #3a171b;
`;


const Image = styled('img')`
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #a9444e;
`;


const Name = styled(Typography)`
    margin-left: 12px !important;
    color: #f5f5f5;
    font-size: 15px !important;
    font-weight: 500 !important;
`;


const Status = styled(Typography)`
    font-size: 12px !important;
    color: #a9444e;
    margin-left: 12px !important;
`;


const RightContainer = styled(Box)`
    margin-left: auto;

    & > svg {
        padding: 8px;
        font-size: 22px;
        color: #999;
        cursor: pointer;
        transition: .2s;
    }

    & > svg:hover {
        color: #e05a65;
        transform: scale(1.1);
    }
`;


const ChatHeader = ({ person }) => {

    const url = person.picture || defaultProfilePicture;

    const { activeUsers } = useContext(AccountContext);

    const online = activeUsers?.find(
        user => user.sub === person.sub
    );

    return (
        <Header>

            <Image
                src={url}
                alt="display picture"
            />

            <Box>
                <Name>{person.name}</Name>

                <Status>
                    {online ? '● Online' : '○ Offline'}
                </Status>
            </Box>

            <RightContainer>
                <Search />
                <MoreVert />
            </RightContainer>

        </Header>
    );
};


export default ChatHeader;