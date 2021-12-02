import {useEffect} from 'react'
import {getAuth} from 'firebase/auth'
import {useHistory} from 'react-router-dom'

const auth = getAuth()

export default function useRedirect() {
    const history = useHistory()

    useEffect(() => {
        if(!auth.currentUser) {
            history.push('/login')
        }
    })
}