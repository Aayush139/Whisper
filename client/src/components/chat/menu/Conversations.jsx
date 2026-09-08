import { useState, useEffect, useContext } from 'react';

import { Box, styled, Divider } from '@mui/material';

import { AccountContext } from '../../../context/AccountProvider';

import Conversation from './Conversation';

import { getUsers } from '../../../service/api';


const Component = styled(Box)`
    background: #0d0d0f;
    overflow: auto;
    height: 81vh;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #5b252c;
        border-radius: 10px;
    }
`;


const StyledDivider = styled(Divider)`
    margin-left: 70px;
    background-color: #2a171a;
    opacity: .7;
`;


const Conversations = ({ text }) => {

    const [users, setUsers] = useState([]);

    const { account, socket, setActiveUsers } =
        useContext(AccountContext);


    useEffect(() => {

        const fetchData = async () => {

            const data = await getUsers();

            const filteredData = data.filter(user =>
                user.name.toLowerCase().includes(text.toLowerCase())
            );

            setUsers(filteredData);
        };

        fetchData();

    }, [text]);


    useEffect(() => {

        socket.current.emit('addUser', account);

        socket.current.on('getUsers', users => {
            setActiveUsers(users);
        });

    }, [account]);


    return (
        <Component>

            {users && users.map((user, index) => (

                user.sub !== account.sub && (
                    <div key={user.sub}>

                        <Conversation user={user} />

                        {users.length !== index + 1 && (
                            <StyledDivider />
                        )}

                    </div>
                )

            ))}

        </Component>
    );
};


export default Conversations;