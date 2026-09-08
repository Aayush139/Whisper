import { Box, styled } from '@mui/material';

const Component = styled(Box)`
    height: 100%;
    background: #080808;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const Image = styled('img')`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const EmptyChat = () => {
    return (
        <Component>
            <Image
                src="/whisper-empty-dark.png"
                alt="Welcome to Whisper"
            />
        </Component>
    );
};

export default EmptyChat;