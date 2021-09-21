import React from 'react'
import {useAppSelector} from '../util/appState/hooks'
import {selectUser} from '../util/appState/userSlice'
import SocketClient from './SocketClient'

function ClientContainer() {
    const user = useAppSelector(selectUser)

    return (
        <React.Fragment>
        {user.friend_list.map(friend => {
            return (
                <React.Fragment key={friend.uid}>
                <SocketClient key={`socket.${friend.uid}`} uid={friend.uid} />
                {/* <ChatClient key={`chat.${friend.uid}`} uid={friend.uid} /> */}
                </React.Fragment>
            )
        })}
        </React.Fragment>
    )
}

export default ClientContainer