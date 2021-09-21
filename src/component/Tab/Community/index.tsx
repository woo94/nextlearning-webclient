import React, { useState } from 'react'
import FriendsOnline from './FriendsOnline'
import FriendsList from './FriendsList'
import AddFriend from './AddFriend'
import FriendsRequest from './FriendsList/FriendsRequest'
import {Container} from '@material-ui/core'
import {ViewContext} from './ViewContext'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'

export function Community() {
    const [viewTracer, setViewTracer] = useState([''])

    let currentView: JSX.Element

    switch (viewTracer[viewTracer.length - 1]) {
        case '':
            currentView = 
            <>
                <FriendsOnline />
                <h3>This is community tab</h3>
                <Router>
                    <div>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/topics">Topics</Link>
                            </li>
                        </ul>

                        <hr />

                        <Switch>
                            <Route exact path="/">
                                <div></div>
                            </Route>
                            <Route path="/topics">
                                <div></div>
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </>
            break
        case 'friend-list':
            currentView =
            <>
                <FriendsList />
            </>
            break
        case 'add-friend':
            currentView = 
            <>
                <AddFriend />
            </>
            break
        case 'requests':
            currentView = 
            <>
                <FriendsRequest />
            </>
            break
        default:
            currentView = 
            <>
                <FriendsOnline />
                <h3>This is community tab</h3>          
            </>
            break
    }

    return (
        <ViewContext.Provider value={{viewTracer, modifyViewTracer:(tracer: Array<string>) => {setViewTracer(tracer)}}}>
            <Container maxWidth="sm" >
                {currentView}
            </Container>
        </ViewContext.Provider>
    )
    
}