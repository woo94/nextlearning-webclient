import React, {useState, useContext} from 'react'
import { useEffect } from 'react'
import {useAppDispatch, useAppSelector} from '../util/appState/hooks'
import {selectUser, getUserDoc, getIdToken} from '../util/appState/userSlice'
import {Grid, Typography, Container, AppBar, Toolbar, Tab, Box, SvgIconTypeMap} from '@mui/material'
import '../firebase'
import {Home as HomeIcon, AccountCircle, Favorite, StarHalf, PinDropSharp} from '@mui/icons-material'
import {BrowserRouter as Router, Route, useHistory, Switch, Link} from 'react-router-dom'
import {Home, Community, Profile, Challenge} from './Tab'
import {SocketContext} from '../socket/context'


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
        <Grid flexGrow={1} item>
            <Link onClick={handler} style={{textDecoration: 'none'}} to={linkTo} >
                <Tab sx={{color: navTitle === tabValue ? 'black' : 'white', width: '100%'}} value={navTitle} label={navTitle} icon={icon} />
            </Link>
        </Grid>
    )
}

function Main() {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const [nav, setNav] = useState('home')
    const [navDisplay, setNavDisplay] = useState('block')

    useEffect(() => {
        if(user.idToken === "") {
            run()
        }
        async function run() {
            await dispatch(getUserDoc(user.uid))
            await dispatch(getIdToken())
        }
    }, [user.idToken])

    const {isSocketAvailable, socket} = useContext(SocketContext)

    useEffect(() => {
        if(!isSocketAvailable) {
            return
        }

        socket.emit("creq.init-friend_list", JSON.stringify({data: user.friend_list.map(friend => friend.uid)}))
        
        return () => {
            console.log(`close socket ${socket.id}`)
            socket.close()
        }
    },[isSocketAvailable])

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
                <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }} >
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