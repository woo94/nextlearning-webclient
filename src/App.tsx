import React from 'react'
import Login from './component/Login'
import Main from './component/Main'
import {selectUser} from './util/appState/userSlice'
import {useAppSelector} from './util/appState/hooks'

function App() {
    const user = useAppSelector(selectUser)
    
    return (
        user.isLogin ? 
            <Main /> 
        :
        <Login />
    )
}

export default App