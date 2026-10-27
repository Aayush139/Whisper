
import { Box, Typography, styled } from '@mui/material';
import { useContext } from 'react';

import { AccountContext } from '../../../context/AccountProvider';

const Own = styled(Box)`
    background: #182b40;
    color: #f5f7fa;
    border-radius: 12px 12px 2px 12px;
    padding: 8px 12px;
    max-width: 65%;
    width: fit-content;
    margin-left: auto;
    margin-right: 8px;
    margin-bottom: 6px;
    overflow-wrap: anywhere;
    word-break: break-word;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

    @media (max-width: 600px) {
        max-width: 82%;
        padding: 7px 10px;
    }
`;

const Other = styled(Box)`
    background: #202024;
    color: #f5f5f5;
    border: 1px solid #342126;
    border-radius: 12px 12px 12px 2px;
    padding: 8px 12px;
    max-width: 65%;
    width: fit-content;
    margin-left: 8px;
    margin-bottom: 6px;
    overflow-wrap: anywhere;
    word-break: break-word;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

    @media (max-width: 600px) {
        max-width: 82%;
        padding: 7px 10px;
    }
`;

const MessageText = styled(Typography)`
    font-size: 14px !important;
    line-height: 1.45 !important;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;

    @media (max-width: 600px) {
        font-size: 13px !important;
    }
`;

const Time = styled(Typography)`
    color: #aaa;
    font-size: 10px !important;
    text-align: right;
    margin-top: 4px !important;
`;

const MessageImage = styled('img')`
    display: block;
    max-width: 100%;
    width: auto;
    height: auto;
    max-height: 320px;
    object-fit: contain;
    border-radius: 8px;
    margin-bottom: 5px;

    @media (max-width: 600px) {
        max-height: 220px;
    }
`;

const Message = ({ message }) => {
    const { account } = useContext(AccountContext);

    const isOwn = message.senderId === account.sub;
    const Wrapper = isOwn ? Own : Other;

    const time = message.createdAt
        ? new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
          })
        : '';

    const isImage =
        message.type === 'file' &&
        typeof message.text === 'string' &&
        /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(message.text);

    return (
        <Wrapper>
            {isImage ? (
                <a href={message.text} target="_blank" rel="noreferrer">
                    <MessageImage src={message.text} alt="Shared image" />
                </a>
            ) : (
                <MessageText>{message.text}</MessageText>
            )}

            {time && <Time>{time}</Time>}
        </Wrapper>
    );
};

export default Message;
