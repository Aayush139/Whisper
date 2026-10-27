
import { useContext, useEffect, useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Search, MoreVert, ArrowBack } from '@mui/icons-material';

import { AccountContext } from '../../../context/AccountProvider';
import { UserContext } from '../../../context/UserProvider';
import { defaultProfilePicture } from '../../../constants/data';

const Header = styled(Box)`
    min-height: 60px;
    box-sizing: border-box;
    background: #0d0d0f;
    display: flex;
    padding: 8px 16px;
    align-items: center;
    border-bottom: 1px solid #3a171b;
    gap: 4px;

    @media (max-width: 600px) {
        padding: 8px 10px;
        min-height: 56px;
        gap: 2px;
    }
`;

const Image = styled('img')`
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #a9444e;
    flex-shrink: 0;

    @media (max-width: 600px) {
        width: 36px;
        height: 36px;
    }
`;

const Name = styled(Typography)`
    margin-left: 12px !important;
    color: #f5f5f5;
    font-size: 15px !important;
    font-weight: 500 !important;

    @media (max-width: 600px) {
        margin-left: 8px !important;
        font-size: 14px !important;
    }
`;

const Status = styled(Typography)`
    font-size: 12px !important;
    color: #a9444e;
    margin-left: 12px !important;

    @media (max-width: 600px) {
        margin-left: 8px !important;
        font-size: 11px !important;
    }
`;

const RightContainer = styled(Box)`
    margin-left: auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    & > svg {
        padding: 6px;
        font-size: 22px;
        color: #999;
        cursor: pointer;
        transition: 0.2s;
    }

    & > svg:hover {
        color: #e05a65;
        transform: scale(1.1);
    }

    @media (max-width: 600px) {
        & > svg {
            padding: 4px;
            font-size: 20px;
        }
    }
`;

const ChatHeader = ({ person }) => {
    const url = person.picture || defaultProfilePicture;

    const { activeUsers, socket } = useContext(AccountContext);
    const { setPerson } = useContext(UserContext);

    const [isTyping, setIsTyping] = useState(false);

    const online = activeUsers?.find(
        user => user.sub === person.sub
    );

    useEffect(() => {
        if (!socket.current) return;

        const handleTyping = data => {
            if (data.senderId === person.sub) {
                setIsTyping(true);
            }
        };

        const handleStopTyping = data => {
            if (data.senderId === person.sub) {
                setIsTyping(false);
            }
        };

        socket.current.on('typing', handleTyping);
        socket.current.on('stopTyping', handleStopTyping);

        return () => {
            socket.current.off('typing', handleTyping);
            socket.current.off('stopTyping', handleStopTyping);
        };
    }, [socket, person.sub]);

    return (
        <Header>
            <Box
                component="button"
                aria-label="Back to conversations"
                onClick={() => setPerson({})}
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 0,
                    background: 'transparent',
                    color: '#eee',
                    padding: '4px',
                    marginRight: '4px',
                    cursor: 'pointer',
                    flexShrink: 0
                }}
            >
                <ArrowBack />
            </Box>

            <Image src={url} alt="display picture" />

            <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                <Name
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {person.name}
                </Name>

                <Status>
                    {isTyping
                        ? `${person.name} is typing...`
                        : online
                            ? '● Online'
                            : '○ Offline'}
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
