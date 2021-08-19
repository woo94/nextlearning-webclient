import React from 'react'
import {useAppSelector} from '../util/appState/hooks'
import {selectUser} from '../util/appState/userSlice'
import SocketClient from './SocketClient'
import ChatClient from './ChatClient'

function SocketClientContainer() {
    const user = useAppSelector(selectUser)

    return (
        <React.Fragment>
        {user.friendList.map(friend => {
            return (
                <>
                <SocketClient key={friend.uid} uid={friend.uid} />
                <ChatClient key={friend.uid} uid={friend.uid} />
                </>
            )
        })}
        </React.Fragment>
    )
}

export default SocketClientContainer