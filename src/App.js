import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer'
import Browse from './pages/Browse'
import backgroundPhoto from './assets/images/pexels-cat1.jpg'

function App() {

  return (
    
    <div className="App" style={{backgroundImage: `url(${backgroundPhoto})`}}>
      <Header/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      <Footer/>
    </div>
  );
}

export default App;
