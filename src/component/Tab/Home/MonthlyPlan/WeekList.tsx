import React from 'react'
import {MonthlyTask} from 'src/util/types'
import {Container, Grid, Typography, Box, Avatar} from '@mui/material'
import {FormatListBulleted} from '@mui/icons-material'
import grey from '@mui/material/colors/grey'
import {useHistory, useRouteMatch} from 'react-router-dom'

interface Props {
    taskMetadataList: Array<Array<MonthlyTask.TaskMetadata>>;
    monthSelect: number;
}

export default function WeekList(props: Props) {
    console.log(props)
    const history = useHistory()
    const match = useRouteMatch()
    console.log(match)

    return (
        <>
            {props.taskMetadataList.map((metadataList, index) => {
                return (
                    <Box sx={{ my: 4 }}>
                        <Box sx={{ border: '1px solid black', width: '120px', py: 1, borderRadius: '30px', textAlign: 'center', my: 2, bgcolor: grey[100] }}>
                            <Typography variant="subtitle1">week {index + 1}</Typography>
                        </Box>
                        <Grid container>
                            {
                                metadataList.map(metadata => (
                                    <Grid my={1} xs={6} item>
                                        <Box onClick={() => {history.push(`${match.url}/edit-task`, { mode: "edit", monthSelect: props.monthSelect, ...metadata })}} sx={{ border: '1px solid black', width: '50%', px: 2, py: 1, borderRadius: '25px' }}>
                                            <Grid alignItems="center" container>
                                                <Grid pr={2} pl={1} item>
                                                    <Avatar>
                                                        <FormatListBulleted />
                                                    </Avatar>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1">
                                                        {metadata.name}
                                                    </Typography>
                                                </Grid>
                                            </Grid>                                    
                                        </Box>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                )
            })}
        </>
    )
}