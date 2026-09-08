import { useContext } from 'react';

import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

import { addUser } from '../../service/api';
import { AccountContext } from '../../context/AccountProvider';

import './WhisperLogin.css';


const LoginDialog = () => {

    const {
        setAccount,
        showloginButton,
        setShowloginButton,
        setShowlogoutButton
    } = useContext(AccountContext);


    const onLoginSuccess = async (res) => {
        try {
            const decoded = jwt_decode(res.credential);

            setAccount(decoded);
            setShowloginButton(false);
            setShowlogoutButton(true);

            await addUser(decoded);

        } catch (error) {
            console.error('Login error:', error);
        }
    };


    const onLoginFailure = (res) => {
        console.log('Login Failed:', res);
    };


    return (
        <div className="whisper-login">

            {/* Background effects */}

            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            <div className="crimson-line line-one"></div>
            <div className="crimson-line line-two"></div>
            <div className="crimson-line line-three"></div>

            <div className="particles"></div>


            {/* Main content */}

            <div className="login-container">

                {/* Left side */}

                <div className="login-intro">

                    <div className="brand">
                        <img
                            src="/whisper-logo_notag_noname.png"
                            alt="Whisper"
                        />

                        <span>Whisper</span>
                    </div>


                    <p className="label">
                        SIMPLE · SECURE · REAL
                    </p>


                    <h1>
                        Conversations
                        <br />
                        Without <span>Limits.</span>
                    </h1>


                    <p className="description">
                        A modern messaging experience built
                        for real conversations and meaningful
                        connections.
                    </p>


                    <div className="features">

                        <div className="feature">
                            <span>⚡</span>
                            Real-time messaging
                        </div>

                        <div className="feature">
                            <span>🔒</span>
                            Private & secure conversations
                        </div>

                        <div className="feature">
                            <span>👥</span>
                            Stay connected with your contacts
                        </div>

                    </div>

                </div>


                {/* Login card */}

                <div className="login-card">

                    <img
                        className="login-logo"
                        src="/whisper-logo_notag_noname.png"
                        alt="Whisper"
                    />


                    <h2>
                        Welcome to <span>Whisper</span>
                    </h2>


                    <p className="login-text">
                        Sign in with your Google account
                        <br />
                        to continue chatting.
                    </p>


                    {showloginButton && (
                        <div className="google-button">

                            <GoogleLogin
                                onSuccess={onLoginSuccess}
                                onError={onLoginFailure}
                            />

                        </div>
                    )}


                    <p className="bottom-text">
                        Good conversations start here.
                    </p>

                </div>

            </div>

        </div>
    );
};


export default LoginDialog;