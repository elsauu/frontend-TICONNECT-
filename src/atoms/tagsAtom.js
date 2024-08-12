// atoms/tagsAtom.js
import { atom } from 'recoil';

// Helper functions to get and set tags in localStorage
const getTagsFromLocalStorage = () => {
  const storedTags = localStorage.getItem('selectedTags');
  return storedTags ? JSON.parse(storedTags) : [];
};

const setTagsInLocalStorage = (tags) => {
  localStorage.setItem('selectedTags', JSON.stringify(tags));
};

const tagsAtom = atom({
  key: 'tagsAtom',
  default: getTagsFromLocalStorage(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(newTags => {
        setTagsInLocalStorage(newTags);
      });
    },
  ],
});

export default tagsAtom;
