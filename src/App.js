import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer'
import Browse from './pages/Browse'
import backgroundPhoto from './assets/images/pexels-cat1.jpg'
import LogIn from './components/LogIn'
import Logo from './components/Logo';

function App() {

  return (
    
    <div className="App" >
      <Header/>
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
      <Footer/>
    </div>
  );
}

export default App;
