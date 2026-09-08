import { useEffect, useState } from 'react';

import { EmojiEmotions, AttachFile, Mic } from '@mui/icons-material';
import { Box, styled, InputBase } from '@mui/material';

import EmojiPicker from 'emoji-picker-react';

import { uploadFile } from '../../../service/api';


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


const Footer = ({ sendText, value, setValue, setFile, file, setImage }) => {

    const [showEmoji, setShowEmoji] = useState(false);

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

    }, [file]);


    const onFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setValue(selectedFile.name);
        setFile(selectedFile);
    };


    const addEmoji = (emojiData) => {
        setValue(prev => prev + emojiData.emoji);
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
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={sendText}
                    value={value}
                />
            </Search>

            <Mic />

        </Container>
    );
};


export default Footer;