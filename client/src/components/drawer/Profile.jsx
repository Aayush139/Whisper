import { useContext } from 'react';
import { Box, styled, Typography } from '@mui/material';

import { AccountContext } from '../../context/AccountProvider';


const ImageContainer = styled(Box)`
    display: flex;
    justify-content: center;
    padding: 30px 0;
    background: #0d0d0f;
`;


const Image = styled('img')`
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #a9444e;
    box-shadow: 0 0 25px rgba(169, 68, 78, .25);
`;


const BoxWrapper = styled(Box)`
    background: #111113;
    padding: 16px 25px;
    border-top: 1px solid #241014;
    border-bottom: 1px solid #241014;

    & :first-child {
        font-size: 12px;
        color: #a9444e;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    & :last-child {
        margin: 10px 0 2px;
        color: #eeeeee;
        font-size: 16px;
    }
`;


const DescriptionContainer = styled(Box)`
    padding: 15px 25px 20px;
    background: #0d0d0f;

    & > p {
        color: #77777d;
        font-size: 12px;
        line-height: 1.5;
    }
`;


const Profile = () => {

    const { account } = useContext(AccountContext);

    return (
        <>
            <ImageContainer>

                <Image
                    src={account?.picture}
                    alt="Profile"
                />

            </ImageContainer>


            <BoxWrapper>

                <Typography>
                    Your name
                </Typography>

                <Typography>
                    {account?.name}
                </Typography>

            </BoxWrapper>


            <DescriptionContainer>

                <Typography>
                    This name is visible to your Whisper contacts.
                </Typography>

            </DescriptionContainer>


            <BoxWrapper>

                <Typography>
                    About
                </Typography>

                <Typography>
                    Eat! Sleep! Code! Repeat
                </Typography>

            </BoxWrapper>
        </>
    );
};


export default Profile;