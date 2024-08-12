import { Box, Flex, Spinner, Input, Button, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();
    const [searchQuery, setSearchQuery] = useState("");

    const getFeedPosts = async () => {
        setLoading(true);
        setPosts([]);
        try {
            const res = await fetch("/api/posts/feed");
            const data = await res.json();

            if (!res.ok || !Array.isArray(data)) {
                showToast("Error", data.error || "Failed to fetch posts", "error");
                setPosts([]);
            } else {
                setPosts(data);
            }
        } catch (error) {
            showToast("Error", error.message, "error");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFeedPosts();
    }, [showToast, setPosts]);

    const searchPosts = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setPosts([]);
        try {
            const res = await fetch(`/api/posts/search/${searchQuery}`);
            const data = await res.json();

            if (!res.ok || !Array.isArray(data)) {
                showToast("Error", data.error || "Failed to fetch posts", "error");
                setPosts([]);
            } else {
                setPosts(data);
            }
        } catch (error) {
            showToast("Error", error.message, "error");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            gap={4}
            align="flex-start"
            p={4}
        >
            <Box flex={2} w="full" mb={{ base: 4, md: 0 }}>
               

                {!loading && posts.length === 0 && (
                    <Heading as="h1" size="lg" textAlign="center">
                        Follow some users to see the feed
                    </Heading>
                )}

                {loading && (
                    <Flex justify="center">
                        <Spinner size="xl" />
                    </Flex>
                )}

                {posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                ))}
            </Box>
            <Box
                flex={{ base: "none", md: 1 }}
                display={{ base: "block", md: "block" }}
                w="full"
                mt={{ base: 4, md: 0 }}
            >
                <SuggestedUsers />
            </Box>
        </Flex>
    );
};

export default HomePage;
