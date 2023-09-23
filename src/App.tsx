import React, { useEffect, useState } from 'react'
import './App.css'
import SignIn from './Modules/General/SignIn';
import SignUp from './Modules/General/SignUp';
import { BrowserRouter as Router } from 'react-router-dom';
import { ILoginData, IUserLoginData } from './Common/ContextStore/ContaxtStore'
import HomePage from './Modules/User/HomePage/HomePage';
import AdminHomePage from './Modules/Admin/HomePage/HomePage';

export const Context = React.createContext<any>(ILoginData);

function App() {
  const [context, setContext] = useState<IUserLoginData>(ILoginData);
  // 1  - Sign In
  // 2  - Sign Up
  // 1  - Forget Password
  useEffect(() => {
    var UserData =  localStorage.getItem('UserData');
    if(UserData !== null) {
      var temp: any = JSON.parse(UserData)
      setContext(temp)
    }
  },[])
  return (
    <Context.Provider value={[context, setContext]}>
      <div>
      { context.Spin ? <></> : <></>}
          <Router>
            {
              context.UserType === 1 ? <AdminHomePage /> : 

              context.UserType === 2 ? <HomePage /> : 
              
              context.page === 1 ? <SignIn /> : 
              
              context.page === 2 ? <SignUp /> :  <></>
            }
          </Router>
      </div>
    </Context.Provider>
  )
}

export default App