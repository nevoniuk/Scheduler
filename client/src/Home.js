import {useState, useCallback, useEffect} from 'react';
import {useNavigate, BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './Home.css';
import Calender from './Calender';
function Home() {
    const [token, setToken] = useState('')
    const [emailText, setEmailText] = useState('')
    const [passwordText, setPasswordText] = useState('')
    const [status, setStatus] = useState('')
    const [error, setError] = useState(null)
    //submitting status is reactive: submitting, success/failure
    const navigate = useNavigate();

    function handleEmailChange(e) {
        setEmailText(e.target.value)
        setStatus('typing')
    }

    function handlePasswordChange(e) {
        setPasswordText(e.target.value)
        setStatus('typing')
    }

    async function verifyCredentials() {
      var token;
       const p = (await fetch('http://localhost:3002/loginattempts',
       {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
             },
           body: JSON.stringify({emailText, passwordText}),
       }).then(async data => {
          token = await data.text();
          if (data.status !== 200) {
            throw new Error(data.statusText)
          } else {
            setToken(token)
            localStorage.setItem('token', token)
            console.log(localStorage)
            setStatus('success')
          }
          
      }).catch(err => console.log(err))) 
    }

	useEffect(() => {
        if (status === 'success') {
            navigate("/Calender")
        }
    }, [status]);

    return (
      <div className="h-screen flex items-center bg-navbar justify-center">
           <div className="w-full max-w-xs ">
              <form className="bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4" onSubmit={verifyCredentials}>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" for="emailText">
                          Username
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      onChange={handleEmailChange} id="emailText" type="text" placeholder="Email" />
                  </div>
                  <div className="mb-6 ">
                      <label className="block text-gray-700 text-sm font-bold mb-2" for="passwordText">
                        Password
                      </label>
                      <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      onChange={handlePasswordChange} id="passwordText" type="password" placeholder="Password" />
                      <p className="text-red-500 text-xs italic">
                                    {error !== null &&
                                            <p>
                                                {error.message}
                                            </p>
                                        }
                      </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="bg-navbar text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled = {status === ''} onClick={verifyCredentials} type="button">
                      Login
                    </button>
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                      Forgot Password?
                    </a>
                  </div>
              </form>
            </div>

      </div>
        
       
    );
   
}


export default Home;


         