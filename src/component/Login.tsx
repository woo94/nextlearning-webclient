import React, {useState} from 'react'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import {makeStyles} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {submitLoginInfo} from '../util/appState/userSlice'
import {useAppDispatch} from '../util/appState/hooks'


const useStyles = makeStyles({
    inputDivs: {
        textAlign: "center",
        margin: "1rem 0"
    },
    login: {
        margin: "4rem 0"
    }
})

function Login() {
    const classes = useStyles()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useAppDispatch()

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async () => {
        await dispatch(submitLoginInfo({email, password}))
    }

    return (
            <Container maxWidth="sm">
                <Typography className={classes.login} variant="h3" align="center">
                    NextLearning.community
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
            </Container>
    )
}

export default Login