import { useContext } from 'react';
import { Box, styled, Typography } from '@mui/material';

import { AccountContext } from '../../context/AccountProvider';

const ImageContainer = styled(Box)`
    display: flex;
    justify-content: center;
    padding: 30px 16px;
    background: #0d0d0f;
`;

const Image = styled('img')`
    width: 180px;
    height: 180px;
    max-width: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #a9444e;
    box-shadow: 0 0 25px rgba(169, 68, 78, 0.25);
`;

const BoxWrapper = styled(Box)`
    background: #171719;
    padding: 18px 25px;
    border-top: 1px solid #302022;
    border-bottom: 1px solid #302022;

    & > p:first-of-type {
        font-size: 12px;
        color: #df626b;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    & > p:last-of-type {
        margin: 10px 0 2px;
        color: #eeeeee;
        font-size: 16px;
        overflow-wrap: anywhere;
    }
`;

const DescriptionContainer = styled(Box)`
    padding: 16px 25px 20px;
    background: #0d0d0f;

    & > p {
        color: #99999f;
        font-size: 12px;
        line-height: 1.7;
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
                <Typography>Your name</Typography>
                <Typography>
                    {account?.name || 'Whisper User'}
                </Typography>
            </BoxWrapper>

            <DescriptionContainer>
                <Typography>
                    This name is visible to your Whisper contacts.
                </Typography>
            </DescriptionContainer>

            <BoxWrapper>
                <Typography>About</Typography>
                <Typography>
                    Eat! Sleep! Code! Repeat
                </Typography>
            </BoxWrapper>
        </>
    );
};

export default Profile;