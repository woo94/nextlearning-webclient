import React from 'react'
import BottomNav from 'src/component/Common/BottomNav'
import {Switch, Route} from 'react-router-dom'
import Summary from './Summary'
import {Container} from '@mui/material'
import Notice from './Notice'
import TaskNav from './TaskNav'
import TaskPanel from './TaskPanel'
import DailyTask from './DailyTask'
import { useRouteMatch } from 'react-router'

export function Home() {
    const {url} = useRouteMatch()

    return (
        <>
            <Container>
                <Summary />
                <Notice />
                <Switch>
                    <Route path={`${url}/:dayInfo`}>
                        <TaskNav />
                    </Route>
                </Switch>
                <Switch>
                    <Route path={`${url}/:dayInfo`}>
                        <TaskPanel />
                    </Route>
                </Switch>
                <BottomNav nav="home" />
            </Container>
        </>
    )
}
