import { useContext } from 'react';

import { Box, styled, Typography } from '@mui/material';
import { GetApp as GetAppIcon } from '@mui/icons-material';

import { AccountContext } from '../../../context/AccountProvider';

import { downloadMedia, formatDate } from '../../../utils/common-utils';
import { iconPDF } from '../../../constants/data';


const Wrapper = styled(Box)`
    background: #171719;
    border: 1px solid #29292c;
    padding: 6px 8px;
    max-width: 60%;
    width: fit-content;
    display: flex;
    border-radius: 10px;
    word-break: break-word;
`;


const Own = styled(Box)`
    background: #421b20;
    border: 1px solid #682b32;
    padding: 6px 8px;
    max-width: 60%;
    width: fit-content;
    margin-left: auto;
    display: flex;
    border-radius: 10px;
    word-break: break-word;
`;


const Text = styled(Typography)`
    font-size: 14px;
    padding: 0 25px 0 5px;
    color: #f1f1f1;
`;


const Time = styled(Typography)`
    font-size: 10px;
    color: #999;
    margin-top: auto;
    white-space: nowrap;
`;


const Message = ({ message }) => {

    const { account } = useContext(AccountContext);

    const Content = message.type === 'file'
        ? <ImageMessage message={message} />
        : <TextMessage message={message} />;

    return account.sub === message.senderId
        ? <Own>{Content}</Own>
        : <Wrapper>{Content}</Wrapper>;
};


const TextMessage = ({ message }) => (
    <>
        <Text>{message.text}</Text>
        <Time>{formatDate(message.createdAt)}</Time>
    </>
);


const ImageMessage = ({ message }) => (
    <Box position="relative">

        {message?.text?.includes('.pdf') ? (
            <Box display="flex">
                <img src={iconPDF} alt="pdf" style={{ width: 60 }} />
                <Typography color="#eee" fontSize={14}>
                    {message.text.split('/').pop()}
                </Typography>
            </Box>
        ) : (
            <img
                src={message.text}
                alt="media"
                style={{
                    width: 300,
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        )}

        <Time style={{
            position: 'absolute',
            bottom: 0,
            right: 0
        }}>
            <GetAppIcon
                onClick={(e) => downloadMedia(e, message.text)}
                fontSize="small"
                style={{
                    marginRight: 8,
                    border: '1px solid #777',
                    borderRadius: '50%',
                    cursor: 'pointer'
                }}
            />
            {formatDate(message.createdAt)}
        </Time>

    </Box>
);


export default Message;