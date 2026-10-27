
import { Box, Typography, styled } from '@mui/material';
import { useContext } from 'react';
import {
    PictureAsPdf,
    Description,
    TableChart,
    Slideshow,
    TextSnippet,
    Download,
    OpenInNew
} from '@mui/icons-material';

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

const FileCard = styled(Box)`
    width: min(290px, 100%);
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const FileInfo = styled(Box)`
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
`;

const FileName = styled(Typography)`
    font-size: 13px !important;
    font-weight: 600 !important;
    overflow-wrap: anywhere;
    word-break: break-word;
`;

const FileSubtitle = styled(Typography)`
    font-size: 11px !important;
    color: #b7c0ca;
    margin-top: 3px !important;
`;

const FileActions = styled(Box)`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const FileAction = styled('a')`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 7px 10px;
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.08);
    color: #f5f7fa;
    font-size: 12px;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    & svg {
        font-size: 16px;
    }
`;

const getExtension = (name) => {
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const getFileName = (url) => {
    try {
        const pathname = new URL(url).pathname;
        return decodeURIComponent(pathname.split('/').pop() || '') || 'Attachment';
    } catch {
        return 'Attachment';
    }
};

const getFileDetails = (extension) => {
    if (extension === 'pdf') {
        return { label: 'PDF document', Icon: PictureAsPdf, color: '#ff777f' };
    }

    if (['doc', 'docx'].includes(extension)) {
        return { label: 'Word document', Icon: Description, color: '#78aaff' };
    }

    if (['xls', 'xlsx'].includes(extension)) {
        return { label: 'Excel spreadsheet', Icon: TableChart, color: '#69d5a0' };
    }

    if (['ppt', 'pptx'].includes(extension)) {
        return { label: 'PowerPoint presentation', Icon: Slideshow, color: '#ffad75' };
    }

    return { label: 'Text document', Icon: TextSnippet, color: '#c4a7ff' };
};

const Message = ({ message }) => {
    const { account } = useContext(AccountContext);

    const isOwn = message.senderId === account?.sub;
    const Wrapper = isOwn ? Own : Other;

    const time = message.createdAt
        ? new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
          })
        : '';

    const text =
        typeof message.text === 'string' ? message.text.trim() : '';

    const isFile = message.type === 'file';
    const isHttpUrl = /^https?:\/\//i.test(text);
    const fileName = isHttpUrl ? getFileName(text) : text;
    const extension = getExtension(fileName);

    const isImage =
        isFile &&
        isHttpUrl &&
        ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);

    const isDocument =
        isFile &&
        isHttpUrl &&
        ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension);

    const details = getFileDetails(extension);
    const DocumentIcon = details.Icon;

    return (
        <Wrapper>
            {isImage ? (
                <a href={text} target="_blank" rel="noreferrer">
                    <MessageImage src={text} alt="Shared image" />
                </a>
            ) : isDocument ? (
                <FileCard>
                    <FileInfo>
                        <DocumentIcon
                            sx={{
                                color: details.color,
                                fontSize: 38,
                                flexShrink: 0
                            }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                            <FileName>{fileName}</FileName>
                            <FileSubtitle>{details.label}</FileSubtitle>
                        </Box>
                    </FileInfo>

                    <FileActions>
                        <FileAction
                            href={text}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <OpenInNew />
                            Open
                        </FileAction>

                        <FileAction
                            href={text}
                            download={fileName}
                        >
                            <Download />
                            Download
                        </FileAction>
                    </FileActions>
                </FileCard>
            ) : (
                <MessageText>{message.text}</MessageText>
            )}

            {time && <Time>{time}</Time>}
        </Wrapper>
    );
};

export default Message;
