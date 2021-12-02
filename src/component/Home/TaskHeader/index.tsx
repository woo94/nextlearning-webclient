import {Grid, Typography, IconButton} from '@mui/material'
import {ArrowBackIos} from '@mui/icons-material'

interface Props {
    handleBack: () => void;
    name: string;
}

export default function TaskHeader(props: Props) {

    return (
        <Grid px={3} py={3} columnGap={3} alignItems="center" container>
            <Grid item>
                <IconButton onClick={props.handleBack}>
                    <ArrowBackIos />
                </IconButton>
            </Grid>
            <Grid item>
                <Typography variant="h6">
                    {props.name}
                </Typography>
            </Grid>
        </Grid>
    )
}

