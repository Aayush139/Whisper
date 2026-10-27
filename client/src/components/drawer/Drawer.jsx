import { styled, Drawer, Box, Typography } from '@mui/material';

import { ArrowBack } from '@mui/icons-material';

import Profile from './Profile';


const Header = styled(Box)`
    height: 70px;
    background: #0d0d0f;
    color: #f5f5f5;

    display: flex;
    align-items: center;

    border-bottom: 1px solid #3a171b;

    & > svg {
        margin-left: 18px;
        padding: 8px;
        cursor: pointer;
        color: #ddd;
        transition: .2s;
    }

    & > svg:hover {
        color: #df626b;
        transform: scale(1.05);
    }
`;


const Text = styled(Typography)`
    font-size: 18px !important;
    font-weight: 600 !important;
    margin-left: 8px !important;
`;


const Component = styled(Box)`
    background: #080808;
    height: calc(100% - 70px);
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #5b252c;
        border-radius: 10px;
    }
`;


const drawerStyle = {
    left: 20,
    top: 17,
    height: '95%',
    width: 'min(380px, calc(100vw - 32px))',
    maxWidth: '100%',
    minWidth: 0,
    background: '#080808',
    boxShadow: '0 20px 60px rgba(0, 0, 0, .8)',
    border: '1px solid #2a171a',
    borderRadius: '12px'
};


const InfoDrawer = ({ open, setOpen, profile }) => {

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <Drawer
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: drawerStyle
            }}
            style={{
                zIndex: 1500
            }}
        >

            <Header>

                <ArrowBack onClick={handleClose} />

                <Text>
                    Profile
                </Text>

            </Header>


            <Component>

                {profile && <Profile />}

            </Component>

        </Drawer>
    );
};


export default InfoDrawer;