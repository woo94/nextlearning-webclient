import React, {useState, useContext} from 'react'
import { useEffect } from 'react'
import {useAppDispatch, useAppSelector} from '../util/appState/hooks'
import {selectUser, requestIdToken} from '../util/appState/userSlice'
import {setFriendRequest, setFriendList} from '../util/appState/friendSlice'
import {selectFriend} from '../util/appState/friendSlice'
import {selectStudyGroup, initStudyGroup, initHostOf, addStudyGroup} from 'src/util/appState/studyGroupSlice'
import {Grid, Typography, Container, AppBar, Toolbar, Tab, Box, SvgIconTypeMap} from '@mui/material'
import {doc, setDoc, getDoc, getFirestore} from 'firebase/firestore'
import { Home as HomeIcon, AccountCircle, Favorite, StarHalf } from '@mui/icons-material'
import { Route, Switch, Link } from 'react-router-dom'
import { Home, Community, Profile, Challenge } from './Tab'
import { SocketContext } from '../socket/context'
import {User} from 'src/util/types'

interface NavItemProps {
    linkTo: string;
    navTitle: string;
    tabValue: string;
    icon: string | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    handler: () => void;
}

function NavItem(props: NavItemProps) {
    const {linkTo, handler, navTitle, tabValue, icon} = props
    return (
        <Grid sx={{py: 1}} flexGrow={1} item>
            <Link onClick={handler} style={{textDecoration: 'none'}} to={linkTo} >
                <Box>
                    {icon}
                </Box>
                <Box>
                    {navTitle}
                </Box>
                {/* <Tab sx={{color: navTitle === tabValue ? 'black' : 'white', width: '100%'}} value={navTitle} label={navTitle} icon={icon} /> */}
            </Link>
        </Grid>
    )
}

function Main() {
    const user = useAppSelector(selectUser)
    const friend = useAppSelector(selectFriend)
    const studyGroup = useAppSelector(selectStudyGroup)
    const dispatch = useAppDispatch()
    const [nav, setNav] = useState('home')
    const [navDisplay, setNavDisplay] = useState('block')

    useEffect(() => {
        const firestore = getFirestore()
        async function run() {
            const friend_list = await readUserDoc()
            await readFriendRequestDoc()
            await readFriendInfoDocs(friend_list)
        }

        async function readUserDoc() {
            const userDoc = await getDoc(doc(firestore, 'user', user.uid))
            const userDocData = userDoc.data() as User.__DOC__USER

            console.log(userDocData)
            
            return userDocData.friend_list
        }

        async function readFriendRequestDoc() {
            const friendRequestDoc = await getDoc(doc(firestore, 'user', user.uid, 'public', 'friend_request'))
            const friendRequestDocData = friendRequestDoc.data() as User.__DOC__PUBLIC_FRIEND_REQUEST

            const incomingRequestUserInfoDocsPromise = friendRequestDocData.received.map(({uid}) => getDoc(doc(firestore, 'user', uid, 'public', 'info')))
            const outgoingRequestUserInfoDocsPromise = friendRequestDocData.sent.map(({uid}) => getDoc(doc(firestore, 'user', uid, 'public', 'info')))

            const incomingRequestUserInfoDocs = (await Promise.all(incomingRequestUserInfoDocsPromise)).filter(doc => Boolean(doc))
            const outgoingRequestUserInfoDocs = (await Promise.all(outgoingRequestUserInfoDocsPromise)).filter(doc => Boolean(doc))

            dispatch(setFriendRequest({sent: incomingRequestUserInfoDocs, received: outgoingRequestUserInfoDocs}))
        }

        async function readFriendInfoDocs(friend_list: Array<string>) {
            const friendInfoDocsPromise = friend_list.map(uid => getDoc(doc(firestore, 'user', uid, 'public', 'info')).then(doc => doc.data()))
            const friendInfoDocs = (await Promise.all(friendInfoDocsPromise)).filter(doc => Boolean(doc))
            
            dispatch(setFriendList(friendInfoDocs.map(doc => { return { ...doc, online: false } })))
        }

        run()
    }, [])

    useEffect(() => {
        if(user.idToken === "") {
            dispatch(requestIdToken())
        }
    }, [user.idToken])

    const {isSocketAvailable, socket} = useContext(SocketContext)

    useEffect(() => {
        if(!isSocketAvailable || !friend.initFriendList) {
            return
        }

        if(friend.friend_list.length > 0) {
            socket.emit("creq.init-friend_list", JSON.stringify({data: friend.friend_list.map(friend => friend.uid)}))
        }
        
        return () => {
            console.log(`close socket ${socket.id}`)
            socket.close()
        }
    },[isSocketAvailable, friend.initFriendList])

    useEffect(() => {
        console.log(studyGroup.initGroups)
        console.log(studyGroup.initHostOf)
        if(!studyGroup.initGroups) {
            console.log('a')
            dispatch(initStudyGroup(user.uid))
            return
        }

        if(!studyGroup.initHostOf) {
            console.log('b')
            dispatch(initHostOf({myUid: user.uid, gids: studyGroup.groups.map(g => g.gid)}))
            return
        }

    }, [studyGroup.initGroups, studyGroup.initHostOf])

    return (
        <Container>
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route path='/challenge'>
                    <Challenge />
                </Route>
                <Route path='/community'>
                    <Community />
                </Route>
                <Route path='/profile'>
                    <Profile />
                </Route>
            </Switch>

            <Box display={navDisplay} >
                <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, textAlign: 'center' }} >
                    <Grid container>
                        <NavItem handler={() => {setNav('home')}} linkTo="/" navTitle={"home"} tabValue={nav} icon={<HomeIcon />} />
                        <NavItem handler={() => {setNav('challenge')}} linkTo="/community" navTitle={"challenge"} tabValue={nav} icon={<Favorite />} />
                        <NavItem handler={() => {setNav('community')}} linkTo="/community" navTitle={"community"} tabValue={nav} icon={<StarHalf />} />
                        <NavItem handler={() => {setNav('profile')}} linkTo="/profile" navTitle={"profile"} tabValue={nav} icon={<AccountCircle />} />
                    </Grid>
                </AppBar>
            </Box>
        </Container>
    )
}

export default Main