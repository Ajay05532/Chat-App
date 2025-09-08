import { useState } from 'react'
import AppContext from './appContext'

const AppContextProvider = (props) =>{

    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);


    const value = {
        userData,setUserData,
        chatData, setChatData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
