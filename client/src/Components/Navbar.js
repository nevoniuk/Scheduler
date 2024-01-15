import React, {useState, useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './Navbar.css'

function NavBar(props) {
    function handleLArrow(e) {
        props.arrowChanged(e)
    }

    function handleRArrow(e) {
      props.arrowChanged(e)
  }
  var d1 = props.startDate.toLocaleDateString()
  var d2 = props.endDate.toLocaleDateString()
  let hours  = Array.apply(null, Array(25))
  const navigate = useNavigate();
    async function logout() {
         const p = (await fetch('http://localhost:3002/loginattempts',
         {
             method: 'DELETE',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': 'Bearer ' + localStorage.getItem('token'),
               },
         }).then(async data => {
            let txt = await data.text();
            if (data.status !== 200) {
              throw new Error(data.statusText)
            } else {
              localStorage.setItem('token', null)
              navigate("/")
            }
            
        }).catch(err => console.log(err))) 
      }

	return (
      <nav className="flex items-center flex-wrap bg-navbar z-50 justify-between p-6">
            <div className="flex items-center .shadow-xl flex-shrink-0 text-white mr-6">
                <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
                <span className="font-semibold text-xl tracking-tight"> My Scheduler</span>
            </div>
              <div className='flex items-center text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-white-500  '>
                  <LeftArrow handleLArrow={handleLArrow}/>
                  <div className='inline-block text-sm px-4 py-2 leading-none text-white  hover:text-white-500 mt-4 lg:mt-0'>
                    {d1 + " - " + d2}
                  </div>
                  <RightArrow handleRArrow={handleRArrow}/>
              </div>
              
              
            <div>
                <button href="#" onClick={logout} className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Logout</button>
            </div>

      </nav>
	);
}



function LeftArrow(props) {
  function handleLArrowClicked(e) {
    props.handleLArrow(e)
  }
  return (
    <button onClick={handleLArrowClicked}>
      <span keyValue="back" class="material-symbols-outlined white-hover">arrow_back_ios</span>
    </button>
);
}

function RightArrow(props) {
  function handleRArrowClicked(e) {
    props.handleRArrow(e)
  }
  return (
    <button onClick={handleRArrowClicked}>
      <span keyValue="forward" class="material-symbols-outlined white-hover"> arrow_forward_ios </span>
    </button>
);
}
export default NavBar;
//'"inline-block px-4 py-2 leading-none border rounded bg-white text-black border-black hover:border-transparent hover:text-black mt-4 lg:mt-0"'