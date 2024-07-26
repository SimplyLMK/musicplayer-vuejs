
 <template>
    <form @submit.prevent = "handleSubmit">
        <h3>Login</h3>
        <input type="email" placeholder="Email" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
        <div v-if = "error" class = "error">{{ error }}</div>
        <button>Log In</button>
    </form>
  </template>
  
  <script>
  
  import useLogin from '@/composables/useLogin';
  import { nextTick } from 'vue';
  import { ref } from 'vue';
  import {useRouter} from 'vue-router'

  export default 
  {
  setup(){
    const {error ,login} = useLogin();
    const email = ref('');
    const password = ref('');
    const router = useRouter()
    
    const handleSubmit = async() =>{
        const res = await login(email.value, password.value)
        if(!error.value)
        {
            console.log('user logged in');
            
            await nextTick()
            {
              router.push({name: 'library'});
              console.log('invoked')
            }
              
            
            
        }
    }
    return {email, password, handleSubmit, error}
  }
  }
  </script>
  
  <style>
  
  </style>