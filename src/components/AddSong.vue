<template>
  <div class="add-song">
    <button v-if="!show" @click="show = true">Add song</button>

    <form v-if="show" @submit.prevent="handleSubmit">
      <h4>Add track</h4>
      <input type="text" placeholder="track name" required v-model="title">
      <input type="text" placeholder="artist" required v-model="artist">
      <input type="file" ref="audioFile" accept="audio/*" @change="handleFileChange">
      <button v-if="!pending" type="submit">Upload</button>
      <button v-else disabled> Loading</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import use_doc from '@/composables/use_doc';
import useStorage from '@/composables/useStorage'; 


export default {
    props: ['playlist', 'audioFile'],
    setup(props) {
    const title = ref('');
    const artist = ref('');
    const show = ref(false);
    const audioFile = ref(null);
    const pending = ref(false);
     

    const {update_doc} = use_doc('playlists', props.playlist.id);
    const { upload, url, filePath } = useStorage(); // initialze to handle the music file upload and the unique url

    const handleSubmit = async() =>
    {
    
    let audioUrl = '';
    if (audioFile.value) {
        pending.value = true;
        await upload(audioFile.value); // Upload the audio file
        audioUrl = url.value; // get the url after upload is finished
    }

    const newSong = 
    {
        title: title.value,
        artist: artist.value,
        id: Math.floor(Math.random()*1000000),
        audioUrl: audioUrl, // set the audioUrl
        filePath: filePath.value,
        views: 0
    }

    await update_doc( //update the songs array 
        {
            songs: [...props.playlist.songs, newSong] //upload the newSong with a bunch of fields
        })
        title.value = '';
        artist.value = '';
        show.value = false;
      pending.value = false;
    } 

    const handleFileChange = (event) => 
    {
      audioFile.value = event.target.files[0];// Get the selected audio file from the input
    }

    
    

    return { title, artist, show, handleSubmit, handleFileChange, audioFile, pending}

  }
}
</script>

<style scoped>
.add-song {
  text-align: center;
  margin-top: 40px;
}
form {
  max-width: 50%;
  text-align: left;
}
</style>
