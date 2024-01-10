import React, {useState, useCallback, useEffect} from 'react';
function SideBar({onEventsChanged}) {
	//have a form that drops beneath it
	const [form, showForm] = useState(false)
	const onClick = () => showForm(!form)
	
	return (
		<>
			<div class="relative pl-3 my-5 flex relative flex-col items-center bg-white">
				<div class=" w-full max-w-xs ">
					{form ? <Form onEventsChanged={onEventsChanged} showForm={showForm}/> : null}
					<div>
						{(!form) ? <>
							<span class="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
							<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" onClick={onClick}> Add Event </button>
						</span></> : null}
					</div>
				</div>
			</div>
		</>
		
	);
}
export default SideBar;


function Form({onEventsChanged, showForm}) {
	
	const [name, setName] = useState('')
	const [start, setStart] = useState('')
	const [end, setEnd] = useState('')
	const [details, setDetails] = useState('')
	const [error, setError] = useState(false)
	const [date, setDate] = useState('')
	function handleShowForm() {
		showForm(false)
	}
	function handleNameChange(e) {

        setName(e.target.value)

    }
	function handleStart(e) {
		//convert to local ti
        setStart(e.target.value)
    }
	function handleEnd(e) {
        setEnd(e.target.value)
		
    }
	function handleDetails(e) {
        setDetails(e.target.value)
		
    }
	function handleDate(e) {
        setDate(e.target.value)
    }

	async function submitEvent(start, end) {
		var result;
		console.log(start)
		console.log(end)
		 const p = (await fetch('http://localhost:3002/events',
		 {
			 method: 'POST',
			 headers: {
				 'Content-Type': 'application/json',
				 'Authorization': 'Bearer ' + localStorage.getItem('token')
			   },
			 body: JSON.stringify({name, start, end, details}),
		 }).then(async data => {
			result = await data.text();
			if (data.status !== 200) {
			  	throw new Error(data.statusText)
			} else {
			  	console.log(result)
				onEventsChanged(true)
				showForm(false)
			}
			
		}).catch(err => console.log(err))) 
	}

	function convertDateTime() {
		console.log(start)
		console.log(end)
		var startDate = new Date()
		var endDate = new Date()
		if (date.length != 10 || start.length != 8 || end.length != 8) { //check if fields are incorrect
			setError(true)
		}
		startDate.setFullYear(date.slice(6,10), date.slice(0, 2) - 1, date.slice(3,5))
		endDate.setFullYear(date.slice(6,10), date.slice(0, 2) - 1, date.slice(3,5))
		var sHours = (start.includes("pm")) ? (parseInt(start.slice(0, 2)) + 12) : parseInt(start.slice(0, 2))
		var eHours = end.includes("pm") ? (parseInt(end.slice(0, 2)) + 12) : parseInt(end.slice(0, 2))
		var sMin = parseInt(start.slice(3,5))
		var eMin = parseInt(end.slice(3,5))
		startDate.setHours(sHours, sMin)
		endDate.setHours(eHours, eMin)	
		submitEvent(startDate, endDate)
	}
	return (
		<form className="bg-navbar shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={convertDateTime}>
			<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="name">
					Enter Event Name
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleNameChange} id="name" type="text" placeholder="Name" />
			</div>
			<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="start">
					Enter Start Time
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleStart} id="start" type="text" placeholder="HH:MM (pm/am)" />
			</div>
			<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="end">
					Enter End Time
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleEnd} id="end" type="text" placeholder="HH:MM (pm/am)" />
			</div>
			<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="date">
					Enter Date
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleDate} id="date" type="text" placeholder="MM/DD/YYYY" />
			</div>
			<div className="mb-4">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="details">
					Enter Details
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleDetails} id="details" type="text" placeholder="Details" />
			</div>
			<label className="block text-red-700 text-sm font-bold mb-2" for="error">
					{error ? <>Incorrect Date/Time Format</> : null}
			</label>
			<div className='flex ml-0 pl-0 flex-row space-between'>
				<span class="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={convertDateTime}> Submit </button>
				</span>
				<span class="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleShowForm}> Cancel </button>
				</span>
			</div>
			
		</form>
	);

}
/**
 * <div className="h-screen flex items-center overflow-y-scroll bg-white justify-center">
           <div className="w-full max-w-xs">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={verifyCredentials}>
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
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled = {status === ''} onClick={verifyCredentials} type="button">
                      Login
                    </button>
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                      Forgot Password?
                    </a>
                  </div>
              </form>
            </div>

      </div>
 * 
 */