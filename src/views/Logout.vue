<script>
import { useLogout } from '@/composables/useLogout';
import {nextTick} from 'vue'


export default{
    setup() 
    {
        const {logout} = useLogout();
        const {useRouter} = useRouter();

        const {handleClick} = async() =>
        {
            await logout();
            console.log('user logged out');
            await nextTick()
            router.push({name: 'Login'})
        }
        return {handleClick}
    }
    
}
</script>
