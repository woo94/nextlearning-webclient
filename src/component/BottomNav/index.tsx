import {BottomNavigation, BottomNavigationAction, Container} from '@mui/material'
import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Home, Today, MenuBook, People, Person} from '@mui/icons-material'

type TabValue = "home" | "plan" | "library" | "friends" | "me"
const tabValues: Array<TabValue> = ["home", "plan", "library", "friends", "me"]

export default function BottomNav() {
    const history = useHistory()
    const path = history.location.pathname

    const [tabValue, setTabValue] = useState<TabValue>(() => {
        for(let i=0; i<tabValues.length; i++) {
            if(path.includes(tabValues[i])) {
                return tabValues[i]
            }
        }

        return "home"
    })

    const handleOnchange = (e: React.SyntheticEvent, value: TabValue) => {
        if(value === "home") {
            history.push(`/${value}/today`)
            return
        }
        else if(value === "plan") {
            history.push(`/${value}/this_month`)
            return
        }
        history.push(`/${value}`)
    }
    
    return (
        <Container maxWidth="xs" sx={{position: 'fixed', bottom: 0, right: 0, left: 0}}>
            <BottomNavigation
                value={tabValue}
                onChange={handleOnchange}
            >
                <BottomNavigationAction icon={<Home />} value="home" label="Home" />
                <BottomNavigationAction icon={<Today />} value="plan" label="Plan" />
                <BottomNavigationAction icon={<MenuBook />} value="library" label="Library" />
                <BottomNavigationAction icon={<People />} value="friends" label="Friends" />
                <BottomNavigationAction icon={<Person />} value="me" label="Me" />
            </BottomNavigation>
        </Container>
    )
}