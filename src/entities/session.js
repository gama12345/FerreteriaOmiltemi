const isSessionStarted = () => {
    if(window.localStorage){
        if(localStorage.getItem("userId")){            
            return true;
        }
    }
    return false;
}

const createNewSession = (userId, role) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("userRole", role);
}

export { isSessionStarted, createNewSession }