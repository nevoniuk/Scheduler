import React, {useState} from 'react';
function WeekEvents(props) {

	//flex
	//has two props: upcoming events and week events from calender
	//const [toggle, setToggle] = useState("Upcoming")
	const [events, setEvents] = useState(props.upcoming)
	console.log(events)
	function setUpcoming() {
		setEvents(props.upcoming)
	}
	function setCurrentWeek() {
		setEvents(props.diffevents)
	}
	
 	return (
			<div className='w-full h-full absolute pr-3 max-w-xs mt-10'>
				<div className="flex flex-row flex-1 mt-4 mb-5">
					<span class=" mr-2 select-none bg-navbar cursor-pointer rounded-[.45rem]">
						<button className="leading-none text-white text-sm px-2 py-2 rounded focus:outline-none focus:shadow-outline" onClick={setUpcoming}>Upcoming Events</button>
					</span>
					<span class=" select-none bg-navbar cursor-pointer rounded-[.45rem]">
						<button className="leading-none text-white text-sm px-3 py-2 rounded focus:outline-none focus:shadow-outline" onClick={setCurrentWeek}>Current Events</button>
					</span>
				</div>
				{(events !== undefined) && (events.length > 0) && 
					<div className='flex flex-col h-full flex-1 mt-5 items-center overflow-scroll'>
						{events.map((e) => (
							<>
								{(e.Events.length > 0) && (e.Events).map((p) => (
									<div className='text-sm mb-2 px-1 py-2 leading-none border bg-navbar rounded text-white shadow-sm'>
										<p className='my-1'>{p.name}</p>
										<p className='my-1'>From: {p.startdate.toLocaleString()}</p>
										<p className='my-1'>To: {p.enddate.toLocaleString()}</p>
									</div>
								))}
							</>
						))}
					</div>}
	
			</div>
			
	);
}
export default WeekEvents;

