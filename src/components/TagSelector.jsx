import { Box, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

const TagSelector = ({ selectedTags, setSelectedTags }) => {
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            const response = await axios.get("/api/tags");
            setAllTags(response.data);
        };
        fetchTags();
    }, []);

    const toggleTag = (tagName) => {
        if (selectedTags.includes(tagName)) {
            setSelectedTags(selectedTags.filter(tag => tag !== tagName));
        } else {
            setSelectedTags([...selectedTags, tagName]);
        }
    };

    return (
        <Box>
            {allTags.map((tag) => (
                <Tag
                    size="md"
                    key={tag._id}
                    borderRadius="full"
                    variant={selectedTags.includes(tag.name) ? "solid" : "outline"}
                    colorScheme="blue"
                    m={1}
                    onClick={() => toggleTag(tag.name)}
                    cursor="pointer"
                >
                    <TagLabel>{tag.name}</TagLabel>
                    {selectedTags.includes(tag.name) && <TagCloseButton onClick={() => toggleTag(tag.name)} />}
                </Tag>
            ))}
        </Box>
    );
};

export default TagSelector;
