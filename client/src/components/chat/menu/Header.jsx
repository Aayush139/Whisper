import { useContext, useState } from 'react';

import { Box, styled } from '@mui/material';

import { AccountContext } from '../../../context/AccountProvider';

import HeaderMenu from './HeaderMenu';
import InfoDrawer from '../../drawer/Drawer';


const Component = styled(Box)`
    height: 44px;
    background: #0d0d0f;
    display: flex;
    padding: 8px 14px;
    align-items: center;
    border-bottom: 1px solid rgba(220, 70, 80, .2);
`;


const Profile = styled('img')`
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: 2px solid #b94b55;
    cursor: pointer;
`;


const Brand = styled(Box)`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 12px;
    color: white;
    font-size: 18px;
    font-weight: 600;
`;


const Logo = styled('img')`
    height: 30px;
    width: 30px;
    object-fit: contain;
`;


const Wrapper = styled(Box)`
    margin-left: auto;
    display: flex;
    align-items: center;

    & > * {
        color: #ddd;
        margin-left: 5px;
    }
`;


const Header = () => {

    const [openDrawer, setOpenDrawer] = useState(false);

    const { account } = useContext(AccountContext);

    const toggleDrawer = () => {
        setOpenDrawer(true);
    };

    return (
        <>
            <Component>

                <Profile
                    src={account?.picture}
                    alt="Profile"
                    onClick={toggleDrawer}
                />

                <Brand>
                    <Logo
                        src="/whisper-logo_notag_noname.png"
                        alt="Whisper"
                    />
                    <span>Whisper</span>
                </Brand>

                <Wrapper>
                    <HeaderMenu />
                </Wrapper>

            </Component>

            <InfoDrawer
                open={openDrawer}
                setOpen={setOpenDrawer}
                profile={true}
            />

        </>
    );
};

export default Header;