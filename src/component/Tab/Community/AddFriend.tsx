import {useState, useContext} from 'react'
import {ViewContext} from './ViewContext'
import ViewChanger, { Props } from '../../Common/ViewChanger'
import Button from '@mui/material/Button'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import grey from '@mui/material/colors/grey'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'

function AddFriend() {
    const viewChangerProps: Props = {
        text: "Add friend",
        actions: [],
        context: ViewContext
    }

    const [mode, setMode] = useState<'email' | 'contact'>('email')
    
    return (
        <>
            <ViewChanger {...viewChangerProps} />
            <Box mb={4} >
            <Fab
                sx={{ mx: 2, boxShadow: 'none', bgcolor: grey[200], opacity: mode === "email" ? 1 : 0.3 }}
                variant="extended"
                onClick={() => setMode('email')}
            >
                <Typography sx={{width: '150px'}} variant="subtitle2">Add by E-mail</Typography>
            </Fab>
            <Fab 
                sx={{mx: 2, boxShadow: 'none', bgcolor: grey[200], opacity: mode === "contact" ? 1 : 0.3 }} 
                variant="extended"
                onClick={() => setMode('contact')}
            >
                <Typography sx={{width: '150px'}} variant="subtitle2">Add by Contacts</Typography>
            </Fab>
            </Box>
            <Box px={3} mb={4}>
                <TextField
                    type="text"
                    fullWidth
                    size="small"
                    placeholder="Email address or Phone number"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            <Box 
                sx={{
                    mx: 'auto',
                    width: '200px'
                }}
            >
            <Fab 
                variant="extended"
                sx={{
                    boxShadow: 'none',
                    width: '150px'
                }}
            >
                Search
            </Fab>
            </Box>
        </>
    )
}

export default AddFriend