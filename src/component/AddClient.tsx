import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import ClearIcon from '@material-ui/icons/Clear'

function AddClient(props: {handler:(name: string) => void}) {
    const [name, setName] = useState('')

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
        setName(e.target.value)
    }

    const handleClearBtn = () => {
        setName('')
    }

    const handleAddBtn = () => {
        props.handler(name)
        setName('')
    }

    return (
        <Grid alignItems="center" container spacing={3}>
            <Grid item>
                <TextField value={name} onChange={handleNameChange} />
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    color="primary"
                    onClick={handleAddBtn}
                >
                    Add Client
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    startIcon={<ClearIcon />}
                    color="secondary"
                    onClick={handleClearBtn}
                >
                    clear
                </Button>
            </Grid>
        </Grid>
        
    )
}

export default AddClient