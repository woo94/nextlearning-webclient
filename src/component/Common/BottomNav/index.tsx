import React, {useState} from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import {Grid, Box, AppBar} from '@mui/material'
import {Home as HomeIcon, AccountCircle, Favorite, StarHalf} from '@mui/icons-material'

interface NavItemProps {
    nav: string;
    linkTo: string;
    navTitle: string;
    icon: string | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    handler: () => void;
}

function NavItem(props: NavItemProps) {
    const {linkTo, navTitle, icon, nav, handler} = props

    const defineItemColor = () => {
        if(navTitle === nav) {
            return 'black'
        }
        else {
            return 'white'
        }
    }

    return (
        <Grid item sx={{py: 1}} flexGrow={1}>
            <Link onClick={handler} to={linkTo} style={{textDecoration: 'none'}} >
                <Box sx={{color: defineItemColor()}}>
                    {icon}
                </Box>
                <Box sx={{color: defineItemColor()}}>
                    {navTitle.toUpperCase()}
                </Box>
            </Link>
        </Grid>
    )
}

interface Props {
    nav: string;
}

export default function BottomNav(props: Props) {
    const {url, path} = useRouteMatch()
    // nav:
    // home, challenge, community, profile
    const [nav, setNav] = useState(props.nav)

    return (
        <AppBar position="fixed" sx={{top: 'auto', bottom: 0, textAlign: 'center'}} >
            <Grid container>
                <NavItem linkTo="/home/today" handler={() => setNav('home')} navTitle="home" nav={nav} icon={<HomeIcon />} />
                <NavItem linkTo="/challenge" handler={() => setNav('challenge')} navTitle="challenge" nav={nav} icon={<Favorite />} />
                <NavItem linkTo="/community" navTitle="community" handler={() => setNav('community')}  nav={nav} icon={<StarHalf />} />
                <NavItem linkTo="/profile" navTitle="profile" handler={() => setNav('profile')} nav={nav} icon={<AccountCircle />} />
            </Grid>
        </AppBar>
    )
}