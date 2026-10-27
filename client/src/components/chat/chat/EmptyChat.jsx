
import { Box, styled, Typography } from '@mui/material';

const Component = styled(Box)`
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: #080808;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 16px;
    box-sizing: border-box;

    @media (max-width: 600px) {
        padding: 8px;
        min-height: 0;
    }
`;

const Content = styled(Box)`
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const Image = styled('img')`
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    object-position: center;

    @media (max-width: 600px) {
        width: 100%;
        height: auto;
        max-height: 70%;
    }
`;

const EmptyChat = () => {
    return (
        <Component>
            <Content>
                <Image
                    src="/whisper-empty-dark.png"
                    alt="Welcome to Whisper"
                />
                <Typography
                    sx={{
                        color: '#aaa',
                        textAlign: 'center',
                        fontSize: { xs: 13, sm: 15 },
                        mt: 2,
                        px: 1
                    }}
                >
                    Select a conversation to start chatting
                </Typography>
            </Content>
        </Component>
    );
};

export default EmptyChat;
