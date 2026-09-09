import { useEffect, useState, useContext } from 'react';

import { EmojiEmotions, AttachFile, Mic } from '@mui/icons-material';
import { Box, styled, InputBase } from '@mui/material';

import EmojiPicker from 'emoji-picker-react';

import { uploadFile } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';


const Container = styled(Box)`
    height: 55px;
    flex-shrink: 0;
    background: #171719;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-sizing: border-box;
    position: relative;

    & > * {
        margin: 5px;
        color: #999;
    }
`;

const Search = styled(Box)`
    flex: 1;
    border-radius: 20px;
    background: #242426;
    border: 1px solid #302022;
`;

const InputField = styled(InputBase)`
    width: 100%;
    padding: 10px 18px;
    font-size: 14px;
    box-sizing: border-box;
    color: #eee;

    & input::placeholder {
        color: #777;
        opacity: 1;
    }
`;

const ClipIcon = styled(AttachFile)`
    transform: rotate(40deg);
    cursor: pointer;
`;

const EmojiButton = styled(EmojiEmotions)`
    cursor: pointer;

    &:hover {
        color: #df626b;
    }
`;

const Picker = styled(Box)`
    position: absolute;
    bottom: 60px;
    left: 10px;
    z-index: 10;
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

            if (file) {

                const data = new FormData();

                data.append('name', file.name);
                data.append('file', file);

                const response = await uploadFile(data);

                setImage(response.data);
            }
        };

        getImage();

    }, [file, setImage]);


    const onFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setValue(selectedFile.name);
        setFile(selectedFile);
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

        if (newValue.length > 0) {

            socket.current.emit('typing', {
                senderId: account.sub,
                receiverId: person.sub
            });

        } else {

            socket.current.emit('stopTyping', {
                senderId: account.sub,
                receiverId: person.sub
            });

        }
    };


    const handleKeyPress = (e) => {

        if (e.key === 'Enter') {

            if (socket.current && account?.sub && person?.sub) {

                socket.current.emit('stopTyping', {
                    senderId: account.sub,
                    receiverId: person.sub
                });

            }

            sendText(e);
        }
    };


    return (
        <Container>

            <EmojiButton onClick={() => setShowEmoji(!showEmoji)} />

            {showEmoji && (
                <Picker>
                    <EmojiPicker
                        onEmojiClick={addEmoji}
                        theme="dark"
                    />
                </Picker>
            )}

            <label htmlFor="fileInput">
                <ClipIcon />
            </label>

            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={onFileChange}
            />

            <Search>

                <InputField
                    placeholder="Type a message"
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    value={value}
                />

            </Search>

            <Mic />

        </Container>
    );
};


export default Footer;