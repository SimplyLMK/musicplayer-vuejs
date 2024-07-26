import { ref } from 'vue'
import { projectFireStore } from '@/firebase/config'

const use_doc = (collection, id) => {
    // Create reactive variables to track error and pending state
    const error = ref(null)
    const pending = ref(false)

    // Create a Firestore document reference
    let doc_ref = projectFireStore.collection(collection).doc(id)

    // Asynchronous function to delete the document
    const delete_doc = async () => {
        pending.value = true
        error.value = null

        try {
            // Delete the document
            const res = await doc_ref.delete()
            pending.value = false
            return res
        } catch (err) {
            console.log(err.message)
        }
    }

    // Asynchronous function to update the document
    const update_doc = async (updates) => {
        pending.value = true
        error.value = null
        
        try {
            // Update the document with the provided updates
            const res = await doc_ref.update(updates)
            pending.value = false
            return res
        } catch (err) {
            console.log(err.message)
        }
    }

    // Return reactive variables and functions
    return { error, pending, delete_doc, update_doc }
}

export default use_doc
