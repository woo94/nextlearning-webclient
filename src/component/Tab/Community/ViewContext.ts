import {createContext} from 'react'

export const ViewContext = createContext({
    viewTracer: [''],
    modifyViewTracer: (tracer: Array<string>) => {}
})