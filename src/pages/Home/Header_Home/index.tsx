import {Grid, Typography, Box} from '@mui/material'
import {ReactComponent as ProfileIcon} from 'src/pages/Home/icons/profile.svg'
import {Verified} from '@mui/icons-material'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectUser} from 'src/util/appState/userSlice'


export default function Header_Home() {
    const user = useAppSelector(selectUser)

    return (
        <Grid sx={{ my: 2 }} alignItems="center" container>
            <Grid textAlign="center" xs={2} item>
                <ProfileIcon />
            </Grid>
            <Grid xs={6} item>
                <Typography variant="body2">Good Morning</Typography>
                <Typography variant="body2">{user.name}</Typography>
            </Grid>
            <Grid xs={4} item>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', bgcolor: '#fbf5e8', py: 1, px: 0.5, borderRadius: '1rem' }}>
                    <Verified />
                    900 Points
                </Box>
            </Grid>
        </Grid>
    )
}

