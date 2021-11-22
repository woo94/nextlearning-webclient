import LibraryPublish from './LibraryPublish'
import {Container} from '@mui/material'
import LCContainer from './LCContainer'

export function Library() {

    return (
        <Container maxWidth="sm">
            <LibraryPublish />
            <LCContainer />
        </Container>
    )
}