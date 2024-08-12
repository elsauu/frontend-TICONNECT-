import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import TagSelector from "../components/TagSelector"; // Importamos el componente de etiquetas
import { useState, useEffect } from "react";
import axios from "axios";

export const SettingsPage = ({ userId }) => {
    const showToast = useShowToast();
    const logout = useLogout();
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchUserTags = async () => {
            const response = await axios.get(`/api/users/${userId}`);
            setSelectedTags(response.data.tags.map(tag => tag.name));
        };
        fetchUserTags();
    }, [userId]);

    const handleSave = async () => {
        try {
            await axios.put(`/api/users/updateTags/${userId}`, { tags: selectedTags });
            showToast("Success", "Tags updated successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const freezeAccount = async () => {
        if (!window.confirm("Are you sure you want to freeze your account?")) return;

        try {
            const res = await fetch("/api/users/freeze", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.error) {
                return showToast("Error", data.error, "error");
            }
            if (data.success) {
                await logout();
                showToast("Success", "Your account has been frozen", "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    return (
        <>
            <Text my={1} fontWeight={"bold"}>
                Freeze Your Account
            </Text>
            <Text my={1}>You can unfreeze your account anytime by logging in.</Text>
            <Button size={"sm"} colorScheme='red' onClick={freezeAccount}>
                Freeze
            </Button>

           
        </>
    );
};
