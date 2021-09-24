import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

interface Props {
    name: string;
    uid: string;
    email: string;
    img: string;
    online: boolean
}

function FriendEntity(props: Props) {
    return (
        <ListItem>
            <ListItemAvatar>
                { props.online ? <AccountCircleIcon /> : <AccountCircleOutlinedIcon />}
            </ListItemAvatar>
            <ListItemText primary={props.name} /> 
        </ListItem>
    )
}

export default FriendEntity