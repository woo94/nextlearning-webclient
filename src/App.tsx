import React from 'react'
import Login from './component/Login'
import Main from './component/Main'
import {selectUser} from './util/appState/userSlice'
import {useAppSelector} from './util/appState/hooks'
import {BrowserRouter as Router, Route} from 'react-router-dom'

// class 방식으로 한번 해보기 이전에 functional component rendering 방식 한번 이해해보기
function App() {
    const user = useAppSelector(selectUser)

    return (
        user.isLogin ?
            <Main /> :
            <Login />
    )
}

export default App