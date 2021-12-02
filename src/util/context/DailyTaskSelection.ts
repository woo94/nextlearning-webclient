import { createContext } from 'react'

interface Context {
    openDialog: boolean;
    onOpenDialog: (plannerId: string) => void;
    onCloseDialog: () => void;
    plannerId: string;
}

const defaultValue: Context = {
    openDialog: false,
    onOpenDialog: () => {},
    onCloseDialog: () => {},
    plannerId: ""
}

export default createContext<Context>(defaultValue)