import {Grid} from '@mui/material'
import DaySelectItem from './DaySelectItem'

interface Props {
    currentIndex: number;
}

export default function DaySelectTab(props: Props) {
    return (
        <Grid sx={{bgcolor: '#f9fafb', px: 3, py: 2, my: 3, borderRadius: '1.5rem'}} justifyContent="space-around" container>
            <DaySelectItem currentIndex={props.currentIndex} itemIndex={-1} />
            <DaySelectItem currentIndex={props.currentIndex} itemIndex={0} />
            <DaySelectItem currentIndex={props.currentIndex} itemIndex={1} />
        </Grid>
    )
}