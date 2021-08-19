import React, {useState, useRef} from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'

function ChatClient(props: {uid: string}) {
    const [text, setText] = useState('')

    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }

    return (
        <Grid alignItems="center" container spacing={4}>
                <Grid style={{margin: '1rem 0'}} item>
                    <TextField onChange={handleText} placeholder="send message" />
                </Grid>
                <Grid>
                    <Button variant="contained" startIcon={<SendIcon />}>send</Button>
                </Grid>
        </Grid>
    )
}

export default ChatClient