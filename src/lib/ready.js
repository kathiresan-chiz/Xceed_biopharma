import { createContext, useContext } from 'react'

// True once the preloader has opened and the page is on screen
export const ReadyContext = createContext(true)

export const useReady = () => useContext(ReadyContext)
