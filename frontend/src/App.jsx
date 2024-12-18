import React, {useState} from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import User from "./page/User.jsx";
import Task from "./page/Task.jsx";
import Layout from "./Component/layout/Layout.jsx";
import Login from "./Component/Auth/Login.jsx";
import LogoutButton from "./Component/Auth/LogoutButton.jsx";
import Profile from "./page/Profile.jsx";
import Role from "./page/Role.jsx";
import Stage from "./page/Stage.jsx";
import ResoureType from "./page/ResoureType.jsx";
import Resouce from "./page/Resouce.jsx";
import Project from "./page/Project.jsx";
import MaterialDistribution from "./page/MaterialDistribution.jsx";
import Finance from "./page/Finance.jsx";
import ActionLog from "./page/ActionLog.jsx";
import TaskReport from "./page/TaskReport.jsx";
import DisplayToken from "./page/Test.jsx";
import Test from "./page/Test.jsx";
import Home from "./page/Home.jsx";

export default function App() {
    const [count, setCount] = useState(0)

    return (<Router>
            <div className="App">
                <Layout>
                    <Routes>
                        <Route index element={<Home/>}/>
                        <Route path="/task" element={<Task/>}/>
                        <Route path="/user" element={<User/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/logout" element={<LogoutButton/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/roles" element={<Role/>}/>
                        <Route path="/stage" element={<Stage/>}/>
                        <Route path="/resoursetypes" element={<ResoureType/>}/>
                        <Route path="/resouse" element={<Resouce/>}/>
                        <Route path="/project" element={<Project/>}/>
                        <Route path="/materialdistribution" element={<MaterialDistribution/>}/>
                        <Route path="/finance" element={<Finance/>}/>
                        <Route path="/actionlog" element={<ActionLog/>}/>
                        <Route path="/taskreport" element={<TaskReport/>}/>
                        <Route path="/displaytoken" element={<Test/>}/>

                        {/*<Route path="/auth" element={<AuthPage/>}/>*/}
                        {/*<Route path="/tickets" element={<ProtectedRoute element={<TicketsPage/>}/>}/>*/}
                        {/*<Route path="/tickets/:ticketId" element={<ProtectedRoute element={<TicketDetailPage/>}/>}/>*/}
                        {/* <Route path="*" element={<ErrorMessage />} /> // Маршрут для ненайденных страниц */}
                    </Routes>
                </Layout>
            </div>
        </Router>

    )
}

// export default App
