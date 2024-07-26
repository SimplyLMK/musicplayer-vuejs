import { ref } from 'vue'
import { projectFireStore } from '../firebase/config'

const useCollection = (collection) => {
  const error = ref(null)

  // Define an asynchronous function to add a new document
  const addDoc = async (doc) => {
    error.value = null

    try {
      // Add the 'doc' object to the specified collection
      const res = await projectFireStore.collection(collection).add(doc)
      return res // Return the response 
    } catch (err) {
      // If an error occurs, log the error message and set the error variable
      console.log(err.message)
      error.value = 'could not send the message'
    }
  }

  // Return an object with the error variable and the addDoc function
  return { error, addDoc }
}

export default useCollection
