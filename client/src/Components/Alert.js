import './Alert.css'
function Alert(props) {
	//functioon that checks if there is another event at the same time
	//props: start and end date of added event
	//Alert: light red background, This event conflicts with blah, would you still like to add? Yes or No
	
	//sets events to null if

	let offset = new Date()
	offset = offset.getTimezoneOffset() / 60
	let conflicts = []
	convertConflicts()
	//console.log(props.conflicts)

	function handleAdd() {
		props.handleAddConflicts("add")
		//props.handleConflicts([])
	}
	function handleCancel() {
		props.handleAddConflicts("cancel")
		//props.handleConflicts([])
	}
	
	function convertConflicts() { //problem gets rendered twice
		for (let i = 0; i < props.conflicts.length; i++) {
			console.log(props.conflicts[i].startdate)
			console.log(props.conflicts[i].enddate)
			let s = new Date(props.conflicts[i].startdate)
			s.setHours(s.getHours() - offset)
			let e = new Date(props.conflicts[i].enddate)
			e.setHours(e.getHours() - offset)
			conflicts[i] = {}
			conflicts[i].startdate = s
			conflicts[i].enddate = e
			conflicts[i].name = props.conflicts[i].name
			//props.conflicts[i].startdate = s
			//props.conflicts[i].enddate = e
			console.log(props.conflicts[i].startdate)
			console.log(props.conflicts[i].enddate)

		}
	}
	console.log(props.conflicts)
	return (
		<div className="main">
           <div className="w-full max-w-xs h-full align-center justify-center flex flex-col overflow-scroll">
                  <div className="mt-8 mb-2 pt-10 px-5">
                      <label className="block text-gray-700 text-md font-bold">
                          Warning
                      </label>
                  </div>
                  <div className="mb-4 pt-4 px-3">
                      <label className="block text-gray-700 text-sm">
                        The following event(s) conflict with this event:
                      </label>
                  </div>
                  <div className="flex flex-col items-center w-full mb-2 justify-between break-all ">
					{props.conflicts.map((_, index) => (
						<>
							<div className='text-black text-sm break-all px-2'>{"Name: " + conflicts[index].name}</div>
							<div className='text-black text-sm break-all px-2'>{"Start: " + (conflicts[index].startdate.toLocaleString())}</div>
							
							<div className='text-black text-sm break-all px-2'>{"End: " + (conflicts[index].enddate.toLocaleString())}</div>
							
						</>
                    ))}
                  </div>
				  <span class="select-none mb-2 items-center rounded-[.95rem]">
						<button className="leading-none bg-navbar text-white mx-6 text-sm px-4 py-2 rounded focus:outline-none focus:shadow-outline" onClick={handleAdd}> Add Event </button>
				  </span>
				  <span class="px-12 select-none mb-2 items-center rounded-[.95rem]">
						<button className="leading-none bg-navbar text-white  text-sm px-4 py-2 rounded focus:outline-none focus:shadow-outline" onClick={handleCancel}> Cancel </button>
				  </span>
            </div>
      </div>

	);
}
export default Alert;