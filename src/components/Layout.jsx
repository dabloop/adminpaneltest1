import { Outlet } from "react-router-dom"
import PanelLogs from './panelLogs';

import '../index.css'

const Layout = () => {
    return (
        <main className="App">
            <PanelLogs />
            <Outlet />
        </main>
    )
}

export default Layout
