import React from 'react'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

function ChatClientContainer() {
    return (
        <Paper variant="outlined">
            <Card>
                <CardHeader 
                    avatar={
                        <Avatar>
                            H
                        </Avatar>
                    }
                    title="chat1"
                    subheader="2021-08-14"
                />
            </Card>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar>
                            M
                        </Avatar>
                    }
                    title="chat2"
                    subheader="2021-08-11"
                />
            </Card>
        </Paper>
    )
}

export default ChatClientContainer