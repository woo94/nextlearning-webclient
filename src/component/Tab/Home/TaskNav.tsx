import React from 'react'
import { grey } from '@material-ui/core/colors'
import {Box, Grid, Chip, IconButton} from '@mui/material'
import {ArrowForwardIos} from '@mui/icons-material'
import {Link, useRouteMatch, Switch, Route, RouteComponentProps} from 'react-router-dom'

interface NavItemProps {
    text: string;
    path: string;
    tabInfo: string;
}

function NavItem(props: NavItemProps) {
    const paths = props.path.split('/')
    const currentTab = paths[paths.length - 1]

    return (
        <Grid sx={{ py: 1 }} flexGrow={2} item>
            <Link style={{textDecoration: "none"}} to={props.path}>
                <Box sx={{boxShadow: currentTab === props.tabInfo ? 2 : 0 }} color="black" borderRadius="30px" minWidth='100px' px={2} py={1.5} display="inline-block" bgcolor={currentTab === props.tabInfo ? 'white' : 'transparent'}>
                    {props.text}
                </Box>
            </Link>
        </Grid>   
    )
}

export default function TaskNav() {
    const match = useRouteMatch()
    const paths = match.url.split('/')
    const currentTab = paths[paths.length -1]
    
    return (
        <>
            <Grid alignItems="center" my={2} borderRadius="40px" bgcolor={grey[200]} fontSize="1rem" textAlign="center" container>
                <NavItem tabInfo={currentTab} path="/home/yesterday" text="Yesterday" />
                <NavItem tabInfo={currentTab} path="/home/today" text="Today" />
                <NavItem tabInfo={currentTab} path="/home/tomorrow" text="Tommorow" />
                <Grid flexGrow={1} item>
                    <Link to="/monthly-plan/this_month">
                        <IconButton>
                            <ArrowForwardIos />
                        </IconButton>
                    </Link>
                </Grid>
            </Grid>
        </>
    )
}