import './App.css';
import backgroundPhoto from './assets/images/pexels-cat1.jpg'
import LogIn from './components/LogIn'
import Logo from './components/Logo'
import Router from './components/Router';



function App() {

  return (
    <>
      <Router/>
      <div className="App" >
        <div className='container'>
          <img src={backgroundPhoto} className="App-logo" alt="logo" Style = {{
          backgroundImage: `url(${backgroundPhoto})`, 
          backgroundSize: "cover, fill",
          backgroundRepeat: "no-repeat", 
          backgroundPosition: "center", 
          height: "100vh", width: "100%"
          }}
          />
        </div>
        <p>
          
        </p>
        <Logo/>
        <LogIn/>
      </div>
    </>
  );
}

export default App;
