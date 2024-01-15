import React, {useState, useCallback, useEffect} from 'react';
import WeekEvents from './WeekEvents';
function SideBar(props) {
	//have a form that drops beneath it
	const [form, showForm] = useState(false)
	const onClick = () => showForm(!form)
	console.log(props.diffevents)
	return (
		<>
			<div className="pl-3 my-5 flex relative flex-col w-full h-full flex-shrink items-center">
				<div className="w-full max-w-xs">
					{form ? <Form handleConflicts={props.handleConflicts} onEventsChanged={props.onEventsChanged} showForm={showForm} addConflict={props.addConflict} conflictingEvents={props.conflictingEvents}/> : null}
					<div>
						{(!form) ? <>
							<span class="pr-3 select-none h-full w-full rounded-[.95rem]">
								<button className="leading-none bg-navbar text-white hover:text-teal-500 text-sm px-4 py-2 rounded focus:outline-none focus:shadow-outline" onClick={onClick}> Add Event </button>
							</span>
						</> : null}
					</div>
				</div>
				<WeekEvents upcoming={props.upcoming} diffevents={props.diffevents}/>
			</div>
		</>
		
	);
}
export default SideBar;


function Form({onEventsChanged, showForm, handleConflicts, addConflict, conflictingEvents}) {
	
	const [name, setName] = useState('')
	const [start, setStart] = useState('')
	const [end, setEnd] = useState('')
	const [details, setDetails] = useState('')
	const [error, setError] = useState(false)
	const [date, setDate] = useState('')

	useEffect(() => {
		if (addConflict === "add" && conflictingEvents.length > 0) { //should only run when alert confirms add conflict
			console.log(conflictingEvents)
			console.log("ADD CONFLICT")
			submitEvent(start, end)
		} else if (addConflict === "cancel") {
			showForm(false)
			handleConflicts([])
		}
	}, [addConflict])

	function handleShowForm() {
		showForm(false)
	}
	function handleNameChange(e) {
        setName(e.target.value)

    }
	function handleStart(e) {
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

	async function checkConflicts(start, end) { //loads all the events for a given week(hardcoded week range)
		console.log(start)
		console.log(end)
		let res = []
		let url = 'http://localhost:3002/eventconflicts/?startDate=' + start.toUTCString() + '&endDate=' + end.toUTCString()
		 const p = (await fetch(url,
		 {
			 method: 'GET',
			 headers: {
				 'Content-Type': 'application/json',
				 'Authorization': 'Bearer ' + localStorage.getItem('token')
			   },
		 }).then(async data => {
			if (data.status === 204) {
				console.log("here")
				submitEvent(start, end)
				//means that there are no conflicts
			}
			else if (data.status !== 200) {
				throw new Error(data)
			}
			else { //means that there are conflicts
				res = await data.json();
				handleConflicts(res) //function in calender
			}
		}).catch(err => console.log(err))) 
	}

	async function submitEvent(start, end) {
		var result;
		console.log(start)
		console.log(end)
		console.log(details)
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
				handleConflicts([])
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
		var sHours = (start.includes("pm") && (parseInt(start.slice(0, 2)) !== 12)) ? (parseInt(start.slice(0, 2)) + 12) : parseInt(start.slice(0, 2))
		var eHours = (end.includes("pm") && (parseInt(end.slice(0, 2)) !== 12)) ? (parseInt(end.slice(0, 2)) + 12) : parseInt(end.slice(0, 2))
		
		var sMin = parseInt(start.slice(3,5))
		var eMin = parseInt(end.slice(3,5))
		startDate.setHours(sHours, sMin)
		endDate.setHours(eHours, eMin)	
		setStart(startDate)
		setEnd(endDate)
		//submitEvent(startDate, endDate)
		checkConflicts(startDate, endDate)
	}
	return (
		<form className="bg-navbar shadow-md rounded pt-5 pb-8 mb-4" onSubmit={convertDateTime}>
			<div className="mb-4 px-8">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="name">
					Enter Event Name
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleNameChange} id="name" type="text" placeholder="Name" />
			</div>
			<div className="mb-4 px-8">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="start">
					Enter Start Time
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleStart} id="start" type="text" placeholder="HH:MM (pm/am)" />
			</div>
			<div className="mb-4 px-8">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="end">
					Enter End Time
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleEnd} id="end" type="text" placeholder="HH:MM (pm/am)" />
			</div>
			<div className="mb-4 px-8">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="date">
					Enter Date
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleDate} id="date" type="text" placeholder="MM/DD/YYYY" />
			</div>
			<div className="mb-4 px-8">
				<label className="block text-gray-700 text-sm font-bold mb-2" for="details">
					Enter Details
				</label>
				<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={handleDetails} id="details" type="text" placeholder="Details" />
			</div>
			<label className="block px-8 text-red-700 text-sm font-bold mb-2" for="error">
					{error ? <>Incorrect Date/Time Format</> : null}
			</label>
			<div className='px-8 items-center'>
				<span class="cursor-pointer my-[.4rem] px-2 rounded-[.95rem] mb-4">
						<button className=" hover:bg-white-700 text-white font-bold py-2  rounded focus:outline-none focus:shadow-outline" type="button" onClick={convertDateTime}> Submit </button>
				</span>
				<span class="cursor-pointer my-[.4rem] px-2 rounded-[.95rem]">
						<button className=" hover:bg-white-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleShowForm}> Cancel </button>
				</span>
			</div>
			
		</form>
	);

}

