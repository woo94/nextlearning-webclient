import React, {useEffect, useState} from 'react'
import {Container, TextField, Typography, Button, Snackbar} from '@mui/material'
import {makeStyles} from '@material-ui/core'
import {getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence} from 'firebase/auth'

const auth = getAuth()

const useStyles = makeStyles({
    inputDivs: {
        textAlign: "center",
        margin: "1rem 0"
    },
    login: {
        padding: "4rem 0"
    }
})

function Login() {
    const classes = useStyles()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false)

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async () => {
        await setPersistence(auth, browserSessionPersistence)
        try {
            await signInWithEmailAndPassword(auth, email, password)
        }
        catch(e) {
            console.log(e)
            setOpenSnackbar(true)
        }
        
    }

    return (
            <Container maxWidth="sm">
                <Typography className={classes.login} variant="h3" align="center">
                    NextLearning.webClient
                </Typography>

                <div className={classes.inputDivs} >
                    <TextField autoComplete="on" value={email} onChange={handleEmailChange}placeholder="Email" />
                </div>

                <div className={classes.inputDivs}>
                    <TextField value={password} onChange={handlePasswordChange} placeholder="Password" type="password" />
                </div>

                <div className={classes.inputDivs}>
                    <Button onClick={handleSubmit} variant="outlined" color="primary" size="large">Login</Button>
                </div>
                <Snackbar open={openSnackbar} message="Login fail! - check out the email and password" onClose={() => {setOpenSnackbar(false)}} autoHideDuration={3000} />
            </Container>
    )
}

export default Login