import useAuth from "./useAuth";

const transformRole = (roles) => {
    // const auth = useAuth()
    // const roles = auth?.auth?.roles
    if(!roles) return 'Unknown';
    if(roles == 1) return 'Admin'
    if(roles == 2) return 'Senior Admin'
    if(roles == 3) return 'Head Admin'
    if(roles == 4) return 'Staff Manager'
    if(roles == 5) return 'Mangmnet'
    if(roles == 6) return 'Server Manager'
    if(roles == 7) return 'Developer'
    if(roles == 8) return 'Owner'
}

export default transformRole