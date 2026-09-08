import { Box, InputBase, styled } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Component = styled(Box)`
    background: #0d0d0f;
    height: 45px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #241014;
`;

const Wrapper = styled(Box)`
    position: relative;
    border-radius: 10px;
    background: #171719;
    margin: 0 10px;
    width: 100%;
    border: 1px solid #29292c;
    transition: .2s;

    &:focus-within {
        border-color: #a9444e;
        box-shadow: 0 0 8px rgba(169, 68, 78, .2);
    }
`;

const Icon = styled(Box)`
    color: #a9444e;
    padding: 8px;
    height: 100%;
    position: absolute;
`;

const InputField = styled(InputBase)`
    width: 100%;
    padding: 16px;
    padding-left: 48px;
    font-size: 14px;
    height: 15px;
    color: #eeeeee;

    & input::placeholder {
        color: #77777d;
        opacity: 1;
    }
`;

const Search = ({ setText }) => {
    return (
        <Component>
            <Wrapper>
                <Icon>
                    <SearchIcon fontSize="small" />
                </Icon>

                <InputField
                    placeholder="Search or start a new chat"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={(e) => setText(e.target.value)}
                />
            </Wrapper>
        </Component>
    );
};

export default Search;