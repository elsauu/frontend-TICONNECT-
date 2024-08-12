// UserPage.jsx
import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Box, Text, Heading } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import tagsAtom from "../atoms/tagsAtom";
import useGetUserProfile from "../hooks/useGetUserProfile"; // Asegúrate de importar el hook
import { useColorMode } from "@chakra-ui/react";


const UserPage = () => {
  const { username } = useParams();
  const { user, loading } = useGetUserProfile(username); // Pasa el username al hook
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const selectedTags = user?.selectedTags || [];
  const { colorMode } = useColorMode();


  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, user]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />

      {/* Mostrar las etiquetas seleccionadas */}
      <Box mt={4}>
        <Heading size="md">Interests</Heading>
        <Flex flexWrap="wrap" mt={2}>
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <Text
                key={tag}
                mr={2}
                bg={colorMode === "dark" ? "black" : "gray.200"}
                p={2}
                borderRadius="md"
                color={colorMode === "dark" ? "white" : "black"}
              >
                {tag}
              </Text>
            ))
          ) : (
            <Text color={colorMode === "dark" ? "white" : "black"}>
              No tags selected.
            </Text>
          )}
        </Flex>
      </Box>

      {!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
