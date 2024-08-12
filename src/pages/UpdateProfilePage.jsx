// UpdateProfilePage.jsx
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
	Checkbox,
	CheckboxGroup
  } from "@chakra-ui/react";
  import { useRef, useState } from "react";
  import { useRecoilState } from "recoil";
  import userAtom from "../atoms/userAtom";
  import tagsAtom from "../atoms/tagsAtom"; // Importa el átomo de etiquetas
  import usePreviewImg from "../hooks/usePreviewImg";
  import useShowToast from "../hooks/useShowToast";
  
  export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
		selectedTags: user.selectedTags || []
	  });
	  const [selectedTags, setSelectedTags] = useState([]);

	// Asegúrate de que selectedTags esté correctamente actualizado
		const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);
  
	const showToast = useShowToast();
	const { handleImageChange, imgUrl } = usePreviewImg();
  
	const handleTagChange = (values) => {
		setSelectedTags(values);
		setInputs({ ...inputs, selectedTags: values });
	  };
	  const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('inputs:', inputs);
		console.log('selectedTags:', selectedTags);
		const selectedTagsArray = Object.keys(selectedTags);
		const updatedInputs = { ...inputs, selectedTags };	
		console.log('updatedInputs:', updatedInputs);
		// ...
		try {
		  const res = await fetch(`/api/users/update/${user._id}`, {
			method: "PUT",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({ ...updatedInputs, profilePic: imgUrl }),
		  });
	  
	  
	
			const data = await res.json(); // updated user object
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
	
			showToast("Success", "Profile updated successfully", "success");
			setUser(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setUpdating(false);
		}
	};
  
	return (
	  <form onSubmit={handleSubmit}>
		<Flex align={"center"} justify={"center"} my={6}>
		  <Stack
			spacing={4}
			w={"full"}
			maxW={"md"}
			bg={useColorModeValue("white", "gray.dark")}
			rounded={"xl"}
			boxShadow={"lg"}
			p={6}
		  >
			<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
			  User Profile Edit
			</Heading>
			<FormControl id='userName'>
			  <Stack direction={["column", "row"]} spacing={6}>
				<Center>
				  <Avatar size='xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
				</Center>
				<Center w='full'>
				  <Button w='full' onClick={() => fileRef.current.click()}>
					Change Avatar
				  </Button>
				  <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
				</Center>
			  </Stack>
			</FormControl>
			<FormControl>
			  <FormLabel>Full name</FormLabel>
			  <Input
				placeholder='John Doe'
				value={inputs.name}
				onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
				_placeholder={{ color: "gray.500" }}
				type='text'
			  />
			</FormControl>
			<FormControl>
			  <FormLabel>User name</FormLabel>
			  <Input
				placeholder='johndoe'
				value={inputs.username}
				onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
				_placeholder={{ color: "gray.500" }}
				type='text'
			  />
			</FormControl>
			<FormControl>
			  <FormLabel>Email address</FormLabel>
			  <Input
				placeholder='your-email@example.com'
				value={inputs.email}
				onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				_placeholder={{ color: "gray.500" }}
				type='email'
			  />
			</FormControl>
			<FormControl>
			  <FormLabel>Bio</FormLabel>
			  <Input
				placeholder='Your bio.'
				value={inputs.bio}
				onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
				_placeholder={{ color: "gray.500" }}
				type='text'
			  />
			</FormControl>
			<FormControl>
			  <FormLabel>Password</FormLabel>
			  <Input
				placeholder='password'
				value={inputs.password}
				onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
				_placeholder={{ color: "gray.500" }}
				type='password'
			  />
			</FormControl>
  
			{/* Nueva sección para seleccionar etiquetas */}
			<FormControl>
  <FormLabel>Tags</FormLabel>
  <CheckboxGroup value={selectedTags} onChange={handleTagChange}>
    <Stack direction={"column"}>
      <Checkbox value="Tecnología">Tecnología</Checkbox>
      <Checkbox value="Música">Música</Checkbox>
      <Checkbox value="Deportes">Deportes</Checkbox>
      <Checkbox value="Literatura">Literatura</Checkbox>
      <Checkbox value="Arte">Arte</Checkbox>
      <Checkbox value="Viajes">Viajes</Checkbox>
    </Stack>
  </CheckboxGroup>
</FormControl>
  
			<Stack spacing={6} direction={["column", "row"]}>
			  <Button
				bg={"red.400"}
				color={"white"}
				w='full'
				_hover={{
				  bg: "red.500",
				}}
			  >
				Cancel
			  </Button>
			  <Button
				bg={"green.400"}
				color={"white"}
				w='full'
				_hover={{
				  bg: "green.500",
				}}
				type='submit'
				isLoading={updating}
			  >
				Submit
			  </Button>
			</Stack>
		  </Stack>
		</Flex>
	  </form>
	);
  }
  