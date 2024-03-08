const LandingPage = () => {
    let userInfo = null;
    try{userInfo = JSON.parse(sessionStorage.getItem('userInfo'));}
    catch(error){
        alert(error.message);
    }
    return (
        <div>
            {userInfo && (
                <>
                    <h1 id="greeting">Welcome, {userInfo.username}!</h1>
                    <p id="credential">Your email is: {userInfo.email}</p>
                </>
            )}
        </div>
    );
};

export default LandingPage;