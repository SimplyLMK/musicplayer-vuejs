<template>
    <form @submit.prevent = "   handleSubmit">
        <h4>Create a new Playlist</h4>
        <input type="text" required placeholder="Title..." v-model="title">
        <input type="text" required placeholder="Artist..." v-model="artist">
        <textarea required placeholder="Description..." v-model="desc"></textarea>
             <div>
                <button v-for="genre in filteredGenres" :key="genre" @click="addGenre(genre)">{{ genre }}</button>
            </div>

        <!-- Selected genres display -->
        <div v-if="selectedGenres.length">
             <h4>Selected Genres:</h4>
            <ul>
                <li v-for="genre in selectedGenres" :key="genre">{{ genre }}</li>
            </ul>
        </div>


        <label> Upload album cover</label>
        <input type="file" @change="handleChange">
        <button v-if="!pending">Create</button>
        <button v-else disabled>Updating...</button>
    </form>

   

</template>

<script>
import { ref, computed } from 'vue';

import useStorage from '@/composables/useStorage'
import {timestamp} from '@/firebase/config'
import useCollection from '@/composables/useCollection';
import getUser from '@/composables/getUser';
import router from '@/router';



export default
{
    setup() 
    {
        //fields
        const genres = ref(['Rock','Pop','EDM','Jazz','Classical', 'Country']);
        const {error, addDoc} = useCollection('playlists');
        const {user} = getUser();
        const {filePath, url, upload} = useStorage();
        const title = ref('');
        const artist = ref('');
        const desc = ref('');
        const file = ref(null); //set initial condition to be false
        const pending = ref(false);


        //methods
        const selectedGenres = ref([]);

        const filteredGenres = computed(() => 
        {
            return genres.value.filter((genre) => !selectedGenres.value.includes(genre));
        });

        const addGenre = (genre) => 
        {
            selectedGenres.value.push(genre);
        };

        const handleSubmit = async () =>
        {
            if(file.value)
            {
                pending.value = true;
                await upload(file.value);
                const res= await addDoc({
                    title: title.value,
                    artist: artist.value,
                    desc: desc.value,
                    userId: user.value.uid,
                    username: user.value.displayName,
                    coverUrl: url.value,
                    filePath: filePath.value,
                    songs: [],
                    selectedGenres: selectedGenres.value,
                    createdAt: timestamp()
                })
                pending.value =false;
                router.push({name: 'PlaylistDetails', params:{ id : res.id}})
            }
    
        }
        const handleChange = (e) => //automatic argument when function is invoked
        {
           console.log(e.target.files[0])
           if(e.target.files[0])
           {
                file.value = e.target.files[0]; //set the value to the selected image file
           }
           else
           {
            file.value = null; //else if user do not select then keep the null
           }
        }
         return { title, artist, desc, handleSubmit, handleChange, pending, filteredGenres, selectedGenres, addGenre }
    } 
}
</script>

<style scoped>
input[type = "file"]
{
    border: 0;
    padding: 0;
}
label
{
    display: block;
    margin-top: 30px;
}
button
{
    margin: 20px;
    
}
</style>