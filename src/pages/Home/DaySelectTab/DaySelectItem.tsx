import {Grid, Typography} from '@mui/material'
import {Link, useRouteMatch} from 'react-router-dom'

interface Props {
    itemIndex: number;
    currentIndex: number;
}

const unselectedTextColor = '#c2c2c2'
const selectedTextColor = "black"
const unselectedBgcolor = "transparent"
const selectedBgcolor = "white"

export default function DaySelectItem(props: Props) {
    const isIndexMatches = props.itemIndex === props.currentIndex

    const linkText = (() => {
        const index = props.itemIndex

        switch(index) {
            case -1:
                return "Yesterday"
            case 0:
                return "Today"
            case 1:
                return "Tomorrow"
            default:
                return "Today"
        }
    })()

    return (
        <Grid sx={{bgcolor: isIndexMatches ? selectedBgcolor : unselectedBgcolor, px: 3, py: 1, borderRadius: '1rem'}} textAlign="center" item>
            <Link style={{textDecoration: 'none'}} to={`/home/${linkText.toLowerCase()}`}>
                <Typography sx={{color: isIndexMatches ? selectedTextColor : unselectedTextColor}}>
                    {linkText}
                </Typography>
            </Link>
        </Grid>
    )
}