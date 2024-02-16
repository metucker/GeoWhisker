import '../App.css';
import '../components/Authentication/Authentication.css';
import backgroundPhoto from '../assets/images/pexels-cat1.jpg'
import LogIn from '../components/Authentication/LogIn'
import SignUp from '../components/Authentication/SignUp';

function Home() {

  return (
    <>
      <div className="Home" >
        <div className='container'>
          
        </div>
        <p>
          
        </p>
        <SignUp/>
        {/* <div className='backgroundPhoto'>
        <img src={backgroundPhoto} className="App-logo" alt="logo" Style = {{
          backgroundImage: `url(${backgroundPhoto})`, 
          backgroundSize: "cover, fill",
          backgroundRepeat: "no-repeat", 
          backgroundPosition: "center", 
          height: "100vh", width: "100%"
          }}
          />
          </div> */}
      </div>
      </>
  );
}

export default Home;
