import { projectStorage } from "@/firebase/config";
import { ref } from "vue";
import getUser from "./getUser";

const {user} = getUser(); //get the user object from getUser.js

const  useStorage =() =>
{
    const error = ref(null);
    const url = ref(null);
    const filePath = ref(null);

 
    const upload = async (file) => {
        filePath.value = `covers/${user.value.uid}/${file.name}`; // Use cd string interpolation into firebase storage
        const storageRef = projectStorage.ref(filePath.value);
    
        try {
            const uploadTask = await storageRef.put(file);
            url.value = await uploadTask.ref.getDownloadURL(); // Await the URL retrieval
            console.log('Image uploaded, URL:', url.value);
        } catch (err) {
            console.log(err.message);
            error.value = err.message;
        }
    };
    const delete_img = async(path) =>
    {
        const storageRef = projectStorage.ref(path);
        await storageRef.delete();
    }


    return {url, filePath, error, upload, delete_img}
}

export default useStorage