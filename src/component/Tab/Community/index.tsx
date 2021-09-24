import React, { useState } from 'react'
import FriendsOnline from './FriendsOnline'
import FriendList from './Friend/FriendList'
import AddFriend from './Friend/AddFriend'
import FriendsRequest from './Friend/FriendList/FriendsRequest'
import {Container} from '@material-ui/core'
import {BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from 'react-router-dom'
import TopController from '../../Common/TopController'
import MyStudyGroup from './MyStudyGroup'
import StudyGroupList from './StudyGroup/StudyGroupList'
import AddStudyGroup from './StudyGroup/AddStudyGroup'

export function Community() {
    const {url} = useRouteMatch()

    return (
        <Container maxWidth="sm" >
            <Switch>
                <Route exact path='/community'>
                    <FriendsOnline />
                    <MyStudyGroup />
                </Route>
                <Route path={`${url}/add-friend`} >
                    <AddFriend />
                </Route>
                <Route path={`${url}/friend-list`}>
                    <FriendList />
                </Route>
                <Route path={`${url}/study-group`}>
                    <StudyGroupList />
                </Route>
                <Route path={`${url}/add-study-group`}>
                    <AddStudyGroup />
                </Route>
            </Switch>
        </Container>
        
    )
    
}