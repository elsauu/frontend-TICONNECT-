import { Button, Flex, Image, Input, Link, useColorMode, Box, Menu, MenuButton, MenuList, MenuItem, IconButton } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const showToast = useShowToast();
    const [searchingUser, setSearchingUser] = useState(false);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleUserSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true);
        try {
            const res = await fetch(`/api/users/profile/${searchQuery}`);
            const searchedUser = await res.json();
            if (searchedUser.error) {
                showToast("Error", searchedUser.error, "error");
                return;
            }
            navigate(`/${searchedUser.username}`);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setSearchingUser(false);
        }
    };

    return (
        <Flex justifyContent={"space-between"} mt={6} mb='12' alignItems="center">
            {user && (
                <Link as={RouterLink} to='/'>
                    <AiFillHome size={24} />
                </Link>
            )}
            {!user && (
                <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
                    Login
                </Link>
            )}

            <Image
                cursor={"pointer"}
                alt='logo'
                w={6}
                src={colorMode === "dark" ? "/itconnectwhite.png" : "/itconnectblack.png"}
                onClick={toggleColorMode}
            />

            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label="Search"
                    icon={<SearchIcon />}
                    variant="outline"
                    colorScheme="teal"
                    size="sm"
                />
                <MenuList>
                    <Box p={4} maxWidth="300px">
                        <form onSubmit={handleUserSearch}>
                            <Input
                                type="text"
                                placeholder="Search for a user"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                mb={2}
                            />
                            <Button type="submit" isLoading={searching} variant="outline" colorScheme="teal" size="sm">
                                Search
                            </Button>
                        </form>
                        {searchResults.length > 0 && (
                            <Box mt={2}>
                                {searchResults.map((result) => (
                                    <MenuItem as={RouterLink} to={`/${result.username}`} key={result._id}>
                                        {result.username}
                                    </MenuItem>
                                ))}
                            </Box>
                        )}
                    </Box>
                </MenuList>
            </Menu>

            {user && (
                <Flex alignItems={"center"} gap={4}>
                    <Link as={RouterLink} to={`/${user.username}`}>
                        <RxAvatar size={24} />
                    </Link>
                    <Link as={RouterLink} to={`/chat`}>
                        <BsFillChatQuoteFill size={20} />
                    </Link>
                    <Link as={RouterLink} to={`/settings`}>
                        <MdOutlineSettings size={20} />
                    </Link>
                    <Button size={"xs"} onClick={logout}>
                        <FiLogOut size={20} />
                    </Button>
                </Flex>
            )}

            {!user && (
                <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
                    Sign up
                </Link>
            )}
        </Flex>
    );
};

export default Header;
