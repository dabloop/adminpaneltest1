import { Link } from "react-router-dom"
import logo from '../logo.png';

const Missing = () => {
    return (
        <article style={{ padding: "100px" }}>
            <img src={logo} alt="Logo" style={{ width: "250px" }} />
            <h1 style={{ fontSize: "100px" }}>Oops!</h1>
            <p style={{ fontSize: "50px" }} >Page Not Found</p>
            <div style={{ fontSize: "20px" }} className="flexGrow">
                <Link to="/">Visit Our Homepage</Link>
            </div>
        </article>
    )
}

export default Missing
