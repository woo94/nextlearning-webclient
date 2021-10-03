import {useState, useEffect} from 'react'
import TopController, { Props } from '../../../../Common/TopController'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import grey from '@mui/material/colors/grey'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import {List, ListItem, ListItemText, ListItemIcon, Button} from '@mui/material'
import {getFunctions, httpsCallable} from 'firebase/functions'

const functions = getFunctions()

interface QueryAddressResult {
    add: boolean; 
    em: string; 
    img: string; 
    isFriend: boolean; 
    name: string; 
    ph: string; 
    uid: string
}

function AddFriend() {
    const [contact, setContact] = useState<Array<QueryAddressResult>>([])

    const viewChangerProps: Props = {
        text: "Add friend",
        actions: [],
    }

    useEffect(() => {
        async function getContact() {
            const url = 'http://localhost:8080/contact'
            const data: Array<{em?: string, ph?: string}> = await fetch(url, {
                method: 'GET'
            }).then(res => res.json())

            const myContact = data.map(({em, ph}): QueryAddressResult => {
                return {
                    em: em ? em : '',
                    ph: ph ? ph : '',
                    add: false,
                    img: '',
                    isFriend: false,
                    name: '',
                    uid: ''
                }
            })
            
            return myContact
        }

        async function queryAddressBook(myContact: Array<QueryAddressResult>) {
            const query_address_book = httpsCallable(functions, 'query_address_book')
            const queryResult: any = await query_address_book({
                users: myContact.map(({em, ph}) => {
                    return {
                        em: em ? em : '',
                        ph: ph ? ph : ''
                    }
                })
            })

            const queryContact: Array<QueryAddressResult> = queryResult.data.result
            const _contact = [...myContact]

            queryContact.forEach(data => {
                const index = _contact.findIndex(val => val.em === data.em || val.ph === data.ph)
                if(index !== -1) {
                    _contact[index] = data
                }
            })

            console.log(_contact)
            
            setContact(_contact)
        }

        async function init() {
            const myContact = await getContact()
            await queryAddressBook(myContact)
        }

        init()
        
    }, [])
    
    return (
        <>
            <TopController {...viewChangerProps} />
            <Box mb={4} >
            {/* <Fab
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
            </Fab> */}
            </Box>
            {/* <Box px={3} mb={4}>
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
            </Box> */}
            <List>
                {contact.map(person => {
                    return (
                        <ListItem
                            secondaryAction={
                                <Button disabled={person.isFriend} >add</Button>
                            }
                        >
                            {
                                person.isFriend ?
                                <ListItemIcon>
                                    <SentimentSatisfiedAltIcon />
                                </ListItemIcon> :
                                null
                            }
                            <ListItemText primary={person.em ? person.em : person.ph} />

                        </ListItem>
                    )
                })}
            </List>
            {/* <Box
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
            </Box> */}
        </>
    )
}

export default AddFriend