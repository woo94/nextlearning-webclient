import {Grid, Typography, Box, IconButton, Card, CardContent, CardActionArea} from '@mui/material'
import {Link, useRouteMatch} from 'react-router-dom'
import {ArrowForwardIos, Person} from '@mui/icons-material'
import SAMPLE from './sample.jpg'
import {selectStudyGroup} from 'src/util/appState/studyGroupSlice'
import {useAppSelector} from 'src/util/appState/hooks'

function StudyGroupWidget() {
    const {url, path} = useRouteMatch()
    const {groups} = useAppSelector(selectStudyGroup)
    const myGroup = ['group1', 'group2', 'group3']
    console.log(url, 'url of StudyGroupWidget')
    console.log(path, 'path of StudtyGroupWidget')
    console.log('re-hi')

    return (
        <>
            <Box py={1} >
                <Grid alignItems="center" container>
                    <Grid item xs={3}>
                        <Typography variant="h6" >
                            Study Group
                        </Typography>
                    </Grid>
                    <Grid item xs={4} ></Grid>
                    <Grid item xs={1}>
                        <Link to={`${url}/study-group`} >
                            <IconButton> <ArrowForwardIos /> </IconButton>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
                {groups.map(group => {
                    return (
                        <Card sx={{width: '350px', my: 3}} >
                            <Link style={{textDecoration: 'none', color: 'black'}} to={`${url}/study-group/${group.gid}`} >
                                <CardActionArea >
                                    <Grid container>
                                        <Grid item xs={4} >
                                            <img style={{ width: '100px', height: '100px' }} src={SAMPLE} />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Grid sx={{ my: 2 }} container>
                                                <Grid item>
                                                    <Typography variant="h5">
                                                        {group.title}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid sx={{ my: 2 }} container>
                                                <Grid xs={3} item>
                                                </Grid>
                                                <Grid xs={6} item></Grid>
                                                <Grid xs={3} item>
                                                    <Person />
                                                    10
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardActionArea>
                            </Link>
                        </Card>
                    )
                })}
            <Box>
                
            </Box>
        </>
    )
}

export default StudyGroupWidget