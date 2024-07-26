import { ref, onBeforeMount } from "vue";
import getUser from "./getUser";
import { projectFireStore } from "@/firebase/config";
import { projectStorage } from "@/firebase/config";

const { user } = getUser();

const getUserAvatar = () => {
  const error = ref(null);
  const url = ref(null);
  const filePath = ref(null);

  const upload = async (file) => {
    filePath.value = `avatars/${user.value.uid}/${file.name}`;
    const storageRef = projectStorage.ref(filePath.value);

    try {
      const uploadTask = await storageRef.put(file);
      url.value = await uploadTask.ref.getDownloadURL();
      console.log("Image uploaded, URL:", url.value);
    } catch (err) {
      console.log(err.message);
      error.value = err.message;
    }
  };

  // Fetch the avatar URL from Firestore before the component mounts
  onBeforeMount(async () => {
    try {
      const doc = await projectFireStore
        .collection("users")
        .doc(user.value.uid)
        .get();

      if (doc.exists) {
        url.value = doc.data().avatarUrl || null;
      }
    } catch (error) {
      console.log("Error fetching avatar URL:", error);
    }
  });

  return { url, filePath, error, upload };
};

export default getUserAvatar;
