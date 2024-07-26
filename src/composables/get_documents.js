import { ref, watchEffect } from 'vue'
import { projectFireStore } from '../firebase/config'

const get_documents = (collection, id) => {

  const document = ref(null)
  const error = ref(null)

  // register the firestore collection reference
  let document_Ref = projectFireStore.collection(collection).doc(id)
    

  const unsub = document_Ref.onSnapshot(doc => {
    if(doc.data())
    {
        document.value = {...doc.data(), id: doc.id};
        console.log('Fetched document:', document.value); 
        error.value = null
    }

   
  }, err => {
    console.log(err.message)
    document.value = null
    error.value = 'could not fetch doc'
  })

  watchEffect((onInvalidate) =>  //method will invoke when unmount
  {
    onInvalidate(() => unsub());
  });

  return { error, document }
}

export default get_documents