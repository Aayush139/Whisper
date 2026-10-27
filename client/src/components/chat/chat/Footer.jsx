
import { useEffect, useState, useContext } from 'react';

import {
    EmojiEmotions,
    AttachFile,
    Mic
} from '@mui/icons-material';

import { Box, styled, InputBase } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';

import { uploadFile } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';

const Container = styled(Box)`
    min-height: 60px;
    flex-shrink: 0;
    background: #171719;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    box-sizing: border-box;
    position: relative;
    border-top: 1px solid #302022;

    @media (max-width: 600px) {
        min-height: 56px;
        gap: 6px;
        padding: 6px 8px;
    }
`;

const Search = styled(Box)`
    flex: 1;
    min-width: 0;
    border-radius: 22px;
    background: #242426;
    border: 1px solid #302022;
`;

const InputField = styled(InputBase)`
    width: 100%;
    padding: 9px 14px;
    font-size: 14px;
    box-sizing: border-box;
    color: #eee;

    & input {
        min-width: 0;
    }

    & input::placeholder {
        color: #777;
        opacity: 1;
    }

    @media (max-width: 600px) {
        padding: 8px 10px;
        font-size: 13px;
    }
`;

const IconButton = styled(Box)`
    width: 32px;
    height: 36px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    cursor: pointer;

    &:hover {
        color: #df626b;
    }

    & svg {
        font-size: 23px;
    }

    @media (max-width: 600px) {
        width: 27px;

        & svg {
            font-size: 21px;
        }
    }
`;

const ClipIcon = styled(AttachFile)`
    transform: rotate(40deg);
`;

const Picker = styled(Box)`
    position: absolute;
    bottom: calc(100% + 8px);
    left: 8px;
    z-index: 20;
    max-width: calc(100vw - 16px);

    @media (max-width: 600px) {
        left: 4px;

        & > aside {
            max-width: calc(100vw - 16px) !important;
        }
    }
`;

const Footer = ({
    sendText,
    value,
    setValue,
    setFile,
    file,
    setImage,
    person
}) => {
    const [showEmoji, setShowEmoji] = useState(false);

    const { socket, account } = useContext(AccountContext);

    useEffect(() => {
        const getImage = async () => {
            if (!file) return;

            try {
                const data = new FormData();
                data.append('name', file.name);
                data.append('file', file);

                const response = await uploadFile(data);
                setImage(response.data);
            } catch (error) {
                console.error('File upload failed:', error);
            }
        };

        getImage();
    }, [file, setImage]);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setValue(selectedFile.name);
        setFile(selectedFile);
        e.target.value = '';
    };

    const addEmoji = (emojiData) => {
        setValue(prev => prev + emojiData.emoji);
    };

    const handleTyping = (e) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (!socket.current || !account?.sub || !person?.sub) {
            return;
        }

        socket.current.emit(
            newValue.length > 0 ? 'typing' : 'stopTyping',
            {
                senderId: account.sub,
                receiverId: person.sub
            }
        );
    };

    const handleKeyPress = (e) => {
        if (e.key !== 'Enter' || e.shiftKey) return;

        e.preventDefault();

        if (socket.current && account?.sub && person?.sub) {
            socket.current.emit('stopTyping', {
                senderId: account.sub,
                receiverId: person.sub
            });
        }

        sendText(e);
    };

    return (
        <Container>
            <IconButton
                onClick={() => setShowEmoji(prev => !prev)}
                aria-label="Toggle emoji picker"
            >
                <EmojiEmotions />
            </IconButton>

            {showEmoji && (
                <Picker>
                    <EmojiPicker
                        onEmojiClick={addEmoji}
                        theme="dark"
                        width="min(320px, calc(100vw - 16px))"
                    />
                </Picker>
            )}

            <IconButton
                component="label"
                aria-label="Attach file"
            >
                <ClipIcon />
                <input
                    type="file"
                    hidden
                    onChange={onFileChange}
                />
            </IconButton>

            <Search>
                <InputField
                    placeholder="Type a message"
                    onChange={handleTyping}
                    onKeyDown={handleKeyPress}
                    value={value}
                    inputProps={{
                        'aria-label': 'Type a message'
                    }}
                />
            </Search>

            <IconButton aria-label="Voice message">
                <Mic />
            </IconButton>
        </Container>
    );
};

export default Footer;
