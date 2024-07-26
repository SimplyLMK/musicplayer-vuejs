<template>
  <div class="navbar">
    <nav>
      <img src="@/assets/logo6.png">
      <h1><router-link :to="{name: 'home'}">Music Entanglement</router-link></h1>

      <div class="links"> 
        <div v-if="user">
          <router-link :to="{name: 'library'}">Home</router-link> 
          <router-link :to="{name: 'home'}">Library</router-link> 
          <router-link :to="{name: 'createPlaylist'}">Upload</router-link> 

          <router-link :to="{name: 'me'}">
            <template v-if="coverUrl">
              <img :src="coverUrl" class="user-avatar">
            </template>
            <template v-else>
             Hi, {{ user.displayName }}
            </template>
          </router-link>
          <button @click="handleClick">Log Out</button>
          
        </div>
        <div v-else>
          <router-link class="btn" :to="{name: 'Signup'}">Sign up</router-link>
          <router-link class="btn" :to="{name: 'Login'}">Login</router-link>
        </div>
        
      </div>
    </nav>
  </div>
</template>

<script>
import useLogout from '@/composables/useLogout';
import { useRouter } from 'vue-router';
import getUser from '@/composables/getUser';

export default {
  setup() {
    const { logout } = useLogout();
    const { user } = getUser();
    const router = useRouter();

    const coverUrl = user ? user.coverUrl : null; // Retrieve coverUrl if user exists

    const handleClick = async () => {
      await logout();
      console.log('user logged out');
      router.push({ name: 'Login' });
    };

    return { handleClick, user, coverUrl };
  },
};
</script>

<style scoped>
 .navbar
{
    padding: 16px 10px;
    margin-bottom: 60px;
    background: #C0FFFF;

}
nav
{
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}
nav h1
{
    margin-left :20px;

}
nav .links
{
    margin-left: auto;

}
nav .links a, button
{
    margin-left: 16px;
    font-size: 16px;

}
nav img
{
    max-height: 50px;
    max-width: 50px;
}



</style>