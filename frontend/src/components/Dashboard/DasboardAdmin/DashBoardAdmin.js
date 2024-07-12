// Import some relevant API
import { Link } from 'react-router-dom';

// NavigationBar
function Layout(){
    return(
        <div class="header">
            <h1 class="brandname">AnySpace</h1>
            <h2 class="navigationbar">
                <ul>
                    <li><Link to ='/adminlogin' class="navigationBarlink"> Home </Link></li>
                    <li><Link to ='/admindashboard' class="navigationBarlink"> Dashboard </Link></li>
                    <li><Link to ='/adminlogin' class="navigationBarlink"> Log Out </Link></li>

                </ul>   
            </h2>
        </div>
    );
}

function Dashboard(){
    return(
        <div>
        <Layout/>
        <p>Hello user, this is an admin dashboard.</p>
        <div class="container">
        </div>
        </div>
    );
}

export default Dashboard;


