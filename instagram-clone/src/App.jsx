import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homescreen from './components/Homescreen/Homescreen'
import {RequireAuth, RequireAuthForNonLogged} from './components/Hooks/RequireAuth'
import Login from './components/Login/Login'
import Profile from './components/Profile/Profile'
import PublicProfile from './components/PublicProfile/PublicProfile'
import Register from './components/Register/Register'
import VerifyEmail from './components/Verify Email/VerifyEmail'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>

        {/* <Route element={<RequireAuthForNonLogged /> }> */}
          <Route path='register' element={<Register /> } />
          <Route path='verifyemail/:token' element={<VerifyEmail />} />
          <Route path='login' element={<Login />} />
        {/* </Route> */}
        <Route element={<RequireAuth />}>
          <Route path='/' element={<Homescreen /> } />
          <Route path='/:username' element={<Profile />} />
          {/* <Route path='/:username' element={<PublicProfile />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
