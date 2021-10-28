import React from 'react'
import Summary from './Summary'
import Notice from './Notice'
import TaskNav from './TaskNav'
import TaskPanel from './TaskPanel'
import AddTaskDialog from './AddTaskDialog'
import SelectModeDialog from './SelectModeDialog'
import BottomNav from 'src/component/Common/BottomNav'

interface Props {
    openAddTaskDialog: boolean;
    setOpenAddTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
    openSelectModeDialog: boolean;
    setOpenSelectModeDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DailyTodo(props: Props) {

    return (
        <>
            <Summary />
            <Notice />
            <TaskNav />
            <TaskPanel
                setOpenAddTaskDialog={props.setOpenAddTaskDialog}
                openSelectModeDialog={props.openSelectModeDialog}
                setOpenSelectModeDialog={props.setOpenSelectModeDialog}
            />
            <AddTaskDialog
                openAddTaskDialog={props.openAddTaskDialog}
                setOpenAddTaskDialog={props.setOpenAddTaskDialog}
            />
            <BottomNav nav="home" />
        </>
    )
}