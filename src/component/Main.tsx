import React, {useState} from 'react'
import { useEffect } from 'react'
import {useAppDispatch, useAppSelector} from '../util/appState/hooks'
import {selectUser, getUserDoc, getIdToken} from '../util/appState/userSlice'
import {BottomNavigation, BottomNavigationAction, Grid, Typography, Container, AppBar, Toolbar, Tabs, Tab, Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import ClientContainer from './ClientContainer'
import MyInfo from './MyInfo'
import ChatClientContainer from './ChatListContainer'
import '../firebase'
import {Home as HomeIcon, AccountCircle, Favorite, StarHalf, PinDropSharp} from '@material-ui/icons'
import {BrowserRouter as Router, Route, useHistory} from 'react-router-dom'
import {Home, Community, Profile, Challenge} from './Tab'
// import {createBrowserHistory} from 'history'

// const history = createBrowserHistory()

const useStyles = makeStyles({
    headings: {
        margin: "2rem 0"
    },
    bottomNav: {
        top: 'auto',
        bottom: 0
    }
})

// let content = <Home />

function Main() {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const [nav, setNav] = useState('home')
    const classes = useStyles()
    const [navDisplay, setNavDisplay] = useState('block')

    useEffect(() => {
        const uid = user.uid
        const run = async () => {
            await dispatch(getUserDoc(uid))
            await dispatch(getIdToken())
        }
        run()
    }, [])

    const handleNavChange = (event: React.ChangeEvent<{}>, value: string) => {
        setNav(value)
    }

    const content = () => {
        let content;
        switch(nav) {
            case 'home':
                content = <Home />
                break
            case 'community':
                content = <Community />
                break            
            case 'profile':
                content = <Profile />
                break
            case 'challenge':
                content = <Challenge />
        }
        return content
    }

    return (
        <Container>
<<<<<<< HEAD
            {
                content()   
            }
            <button onClick={(e) => {if(navDisplay === "block") {setNavDisplay("none")} else {setNavDisplay("block")}}} >oh</button>
            <Box display={navDisplay} >
                <AppBar position="fixed" className={classes.bottomNav} >
                    <Tabs
                        value={nav}
                        onChange={handleNavChange}
                        centered
                        variant="fullWidth"
                    >
                        <Tab value="home" label="Home" icon={<HomeIcon />} />
                        <Tab value="challenge" label="Challenge" icon={<Favorite />} />
                        <Tab value="community" label="Community" icon={<StarHalf />} />
                        <Tab value="profile" label="Profile" icon={<AccountCircle />} />
                    </Tabs>
                </AppBar>
            </Box>
=======
            <Typography className={classes.headings} variant="h4">MyInfo</Typography>
            <MyInfo />
            <Typography className={classes.headings} variant="h4">Socket Clients(Persistent)</Typography>
            <Grid container>
                <Grid item xs={6}>
                    <ClientContainer />
                </Grid>
                <Grid item xs={6}>
                    
                </Grid>
            </Grid>
            
            <Typography className={classes.headings} variant="h4">Socket Clients(Temporary)</Typography>
>>>>>>> fdf3a8a7440954b3d1c2f53fece34da65e3425e5
        </Container>
    )
}

export default Main