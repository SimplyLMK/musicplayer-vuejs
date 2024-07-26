<template>
  <div>
    <div class="user-info">
      <div class="info-container">
        <div class="image-cropper">
          <img :src="coverUrl" alt="Cover Image">
              
        </div>
        
        
        <div class="user-playlist">
          <div class="header">
            <h2>{{ user.displayName }}'s Playlists</h2>
               <p>{{bio}}</p>
            
          </div>
          <div v-if="playlists">
            <ListView :playlists="playlists" />
          </div>
        </div>
      </div>
    </div>

     

    <form v-if="editMode" @submit.prevent="handleSubmit">
      <h4>Edit user profile</h4>

      <label>Avatar</label>
      <input type="file" @change="handleChange">
      
      <label>Bio</label>
      <textarea v-model="bio"></textarea>
      
      <button v-if="!pending">Update</button>
      <button v-else disabled>Updating...</button>
    </form>
    <button @click="toggleEditMode">{{ editMode ? 'Cancel' : 'Edit' }}</button>
     
    
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import getUserAvatar from '@/composables/getUserAvatar';
import useCollection from '@/composables/useCollection';
import getUser from '@/composables/getUser';
import { timestamp } from '@/firebase/config';
import { useRouter } from 'vue-router';
import useLogout from '@/composables/useLogout';
import getCollection from '@/composables/getCollection';

import ListView from '@/components/ListView';

export default {
  components:{ListView},

  setup() {
    const { error, addDoc } = useCollection('users_info');
    const { user } = getUser();
    const { filePath, url, upload } = getUserAvatar();
    const router = useRouter();
    const {documents: playlists} = getCollection('playlists', ['userId', '==', user.value.uid]);


    const file = ref(null);
    const pending = ref(false);
    const coverUrl = ref(localStorage.getItem('coverUrl') || null);
    const bio = ref(localStorage.getItem('bio') || ''); 
    const editMode = ref(false);
    

    const handleSubmit = async () => {
      if (file.value) {
        pending.value = true;
        await upload(file.value);
        await addDoc({
          username: user.value.displayName,
          coverUrl: url.value,
          bio: bio.value,
          filePath: filePath.value,
          createdAt: timestamp(),
        });
        pending.value = false;
        coverUrl.value = url.value;
        localStorage.setItem('coverUrl', url.value);
        localStorage.setItem('bio', bio.value); 
      }
    };

    const handleChange = (e) => {
      if (e.target.files[0]) {
        file.value = e.target.files[0];
      } else {
        file.value = null;
      }
    };

    

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    onMounted(() => {
      if (!coverUrl.value) {
        coverUrl.value = localStorage.getItem('coverUrl') || null;
      }
    });

    return { handleSubmit, handleChange, pending, coverUrl, user, bio, editMode, toggleEditMode, playlists };
  },
};
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

.info-container {
  display: flex;
  
  margin-bottom: 20px;
}

.image-cropper 
{
  width: 300px;
  height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
   margin-right: 150px;
   z-index: 1;
}

img {
  display: inline;
  margin: 0 auto;
  height: auto;
  width: 100%;
  z-index:1;
}
.user-info {
    text-align: left;
  }
  .user-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 40px;
  }
  .user-info p {
     margin-top: 40px;
    margin-bottom: 20px;
  }

  .user-bio 
  {
  margin-top: 20px; 
  z-index: 2;
  }


</style>