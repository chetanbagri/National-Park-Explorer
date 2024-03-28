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
                </>
            )}
        </div>
    );
};

export default LandingPage;