import {createContext} from 'react'

export const FirebaseContext = createContext<firebase.default.app.App | null>(null)