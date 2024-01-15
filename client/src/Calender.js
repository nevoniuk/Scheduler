import React, {useState, useCallback, useEffect} from 'react';
import './Calender.css';
import NavBar from './Components/Navbar'
import SideBar from './Components/SideBar'
import Alert from './Components/Alert'
/**
 * 1. Front end queries with dates in UTC time
 * 2. Front end receives responses in UTC time and converts to local time
 */

const Days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"]
var currdate = new Date()
currdate.setHours(0,0,0)
var currenddate = new Date()
currenddate.setHours(0,0,0)
currenddate.setDate(currenddate.getDate() + 7)

function Calender() { 
 
    const [eventsChanged, setEventsChanged] = useState(false)
    const [days, setDays] = useState([])
    let arrow = ""
    var millisecondsInWeek = 86400000 * 7
    const [endDate, setEndDate] = useState(currenddate)
    const [startDate, setStartDate] = useState(currdate)
    const [conflictingEvents, setConflictingEvents] = useState([])
    const [addConflict, setAddConflict] = useState("")
    const [upcoming, setUpcoming] = useState(null)
    let hours  = Array.apply(null, Array(25))
    
   function handleUpcoming(events) {

        if ( upcoming === null && (startDate.getDate() ===  currdate.getDate()) && (startDate.getMonth() === currdate.getMonth())) {
            setUpcoming(events)
        }
   }

    function arrowChanged(e) {
        arrow = e.target.getAttribute('keyValue')
        changeHours()
    }

    function handleConflicts(events) {
        setConflictingEvents(events)
        setAddConflict("") //otherwise navbar stays as "cancel, or add"
    }
    function handleAddConflicts(v) {
        let newVal = v
        setAddConflict(newVal) //need a new object
    }
    function changeHours() {
        if (arrow === "forward") {
            setStartDate(endDate)
            var newEnd = new Date(endDate.getTime() + millisecondsInWeek)
            setEndDate(newEnd)
            loadEvents(endDate, newEnd)       
        }
        else if (arrow === "back") {
            setEndDate(startDate)
            var newStart = new Date(startDate.getTime() - millisecondsInWeek)
            setStartDate(newStart)
            loadEvents(newStart, startDate)
        }
    }
    const onEventsChanged = () => {
        setEventsChanged(true)
    };

    useEffect(() => {//triggers rerender when events have changed and for initial render
        setEventsChanged(false)
        loadEvents(startDate, endDate) //these dates have not changed
    }, [eventsChanged])

    async function loadEvents(startDate, endDate) { //loads all the events for a given week(hardcoded week range)
        let res = []
        let url = 'http://localhost:3002/events/?startDate=' + startDate.toUTCString() + '&endDate=' + endDate.toUTCString()
         const p = (await fetch(url,
         {
             method: 'GET',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
         }).then(async data => {
            if (data.status === 204) {
                getDays([], startDate, endDate)
            }
            else if (data.status !== 200) {
                throw new Error(data)
            }
            else {
                res = await data.json();
                console.log(res)
                getDays(res, startDate, endDate)
            }
        }).catch(err => console.log(err))) 
    }

    function getDays(dayEvents, startDate, endDate) {

        let tempdays = []
        var counter = 0;
        if (dayEvents.length != 0) { //hours to subtract
            var offset = new Date(dayEvents[0].startdate).getTimezoneOffset() / 60
        }
        //dates are in ascending order
        for (let i = 0; i < 8; i++) {
            tempdays[i] = {
                "name": Days[(startDate.getDay() + i) % 7],
                "numevents": 0,
                "Events": []
            }
            var date = new Date(startDate)
            date.setDate(date.getDate() + i)
            tempdays[i].date = date.toLocaleDateString()
            if (counter < dayEvents.length) {
                let s = new Date(dayEvents[counter].startdate)
                s.setHours(s.getHours() - offset) 
                let tempDate = new Date(startDate)
                tempDate.setDate(tempDate.getDate() + i)
                while (s.getDate() === tempDate.getDate()) {
                    let event = dayEvents[counter]
                    let start = new Date(event.startdate)
                    let end = new Date (event.enddate)
                    start.setHours(start.getHours() - offset)
                    end.setHours(end.getHours() - offset)
                    event.startdate = start
                    event.enddate = end
                    //already defined a day object above
                    let arr = []
                    if (tempdays[i].Events !== null) {
                        arr = tempdays[i].Events
                    }
                    arr.push(event)
                    tempdays[i].Events = arr
                    tempdays[i].numevents = tempdays[i].numevents + 1
                    counter += 1
                    if (counter === dayEvents.length) {
                        break;
                    } else {
                        s = new Date(dayEvents[counter].startdate) //converts to local automatically
                        s.setHours(s.getHours() - offset)
                    }
                }
            }
        }
        setDays(tempdays)
        handleUpcoming(tempdays)
    }
    /** Creates an array of day objects that contain corresponding events and converts UTC to local*/
    return (
        <div className='body'>
            <div>{conflictingEvents != undefined && conflictingEvents.length > 0 && 
                < Alert conflicts={conflictingEvents} handleAddConflicts={handleAddConflicts} handleConflicts={handleConflicts}/>}
            </div>
            <div className='Container'>
                <NavBar startDate={startDate} endDate={endDate} arrowChanged={arrowChanged}/>
                <div className='ContainerOne'>
                    {(days.length > 0) &&
                        <SideBar handleConflicts={handleConflicts} onEventsChanged={onEventsChanged} addConflict={addConflict}
                        conflictingEvents={conflictingEvents} upcoming={upcoming} diffevents={days}/>
                    }
                    
                        {(days.length > 0) && 
                            <div className='Day-Names'>
                                {days.map((_, index) => (
                                <div key={index} className='text-sm my-6 px-2 py-2 leading-none border rounded text-black border-navbar'>
                                    <p>{days[index].name}</p>
                                    <p>{days[index].date}</p>
                                </div>
                                ))}
                            </div>}
                    {(days.length > 0) && 
                        <div className='WeekViewContainer'>
                           <div className='Numberline'>
                                {hours.map((_, index) => (
                                    <div className='text-xs'>{(((index % 12) == 0)? (12) : (index % 12))
                                        + ((index == 0) ? ("am") : ("")) + ((index == 12) ? ("pm") : (""))}
                                    </div>     
                                ))}
                            </div>
                            
                            <div className='WeekView'>
                                {days.map((_, index) => (
                                        <Day key={index} day={days[index]}/>
                                    ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
        
    );
}
/**Adds all events for a day into flex box rows */

function Day(props) {
    const style = {
        width: '100%',
        display: 'grid',
        height: '100%',
        position: 'relative',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: "repeat(1, 1fr)",
        gridGap: '1px',
        backgroundColor: '#9b9797;',
        borderBottom: 'ridge #9b9797',
        zIndex: '4000',
        
    }
    const [displayEvent, setdisplayEvent] = useState(null)
    function handleDisplayEvent(event) {
        setdisplayEvent(event)
    }

    let events = props.day.Events;
    let i = 0;
    let rowEndTimes = []
    let hours  = Array.apply(null, Array(25))
  
 
    while (i < events.length) {
        var start = events[i].startdate
        let j = 0
        for (j = 0; j < rowEndTimes.length; j++) {
            let arr = rowEndTimes[j]
            let lastTime = arr[arr.length - 1].enddate
            if (lastTime < start) {
                arr.push(events[i])
                rowEndTimes[j] = arr
                start = 0;
                break;
            }
        }
        if (start !== 0 && rowEndTimes[j] === undefined) {
            let arr = []
            arr.push(events[i])
            rowEndTimes[j] = arr
        }
       i++;
    }
    return (
        <div className='DayRow'>
            <div className='a'>
            {(displayEvent!= null && displayEvent.name != undefined) ? <Popup handleDisplayEvent={handleDisplayEvent} displayEvent={displayEvent}/> : null}
            </div>
            
            <div className='EventRowsContainer'>
                {rowEndTimes.map((_, index) => (
                    <EventRow key={index} events={rowEndTimes[index]} handleDisplayEvent={handleDisplayEvent}/>
                ))}
            </div>     
            <div className='day' style={style}> 
                {hours.map((_, index) => (
                    <Hour key={index} hour={index} />
                ))}
            </div>
            
       </div>
    );
}

/**Determines how the events in each row appear on the grid */

function EventRow({events, handleDisplayEvent}) { 
    
    function handleEventClicked(e) {
        var i = e.target.getAttribute('keyValue')
        var ev = Number(i)
        handleDisplayEvent(events[ev])
    }
    
    let styles = []
    var total = 3600000 * 24
    let s = events[0].startdate
    var d = new Date(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0) //midnight that same day
    let start = ((events[0].startdate - d) / total) * 100
    const rowStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '' + start + '%',
        gap: '2px',
        flexShrink: '1',
        marginTop: '1px'
    }
    var prev = null
    for (let i = 0; i < events.length; i++) {

        var diff = (events[i].enddate - events[i].startdate)
 
        var t = (diff / total) * 100
        let style = {
            flexBasis: '' + (t) +'%',
            backgroundColor: '#a0a7be',
            borderRadius: '2px'
        }
        if (i > 0) {
            let margin = ((events[i].startdate - prev.enddate) / total) * 100
            style = {
                flexBasis: '' + (t) +'%',
                backgroundColor: '#a0a7be',
                borderRadius: '2px',
                marginLeft: '' + margin + '%',
            }
        }
        prev = events[i]
        styles.push(style)
    }
    return (
        <div className='eventRow' style={rowStyle}>
            {styles.map((_, index) => (
                <>
                    <button className='' key={index}  keyValue={index} style={styles[index]} onClick={handleEventClicked}/>
                </>
            ))}
        </div>
    );
    
}

function Hour({hour}) {
    const style = {
        gridColumnStart: hour,
        gridColumnEnd: hour + 1,
        gridRowStart: 1,
        gridRowEnd: "span 1", 
        background: 'white',
    }
    return (
        <>
            <div style={style} ></div>
        </>
    );
}

function Popup(props) {
    function handleClick() {
        props.handleDisplayEvent(null)
    }
    return (
        <div className="w-30 h-20 flex flex-col items-center absolute justify-center">
            <div className=" bg-navbar shadow-md overflow-scroll rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    Event:
                        <label className="block text-gray-700 text-sm font-light mb-2">
                        {props.displayEvent.name}
                        </label>
                </div>
                <div className="mb-4">
                    Details:
                        <label className="block text-gray-700 text-sm font-light mb-2">
                        {props.displayEvent.details}
                        </label>
                </div>
                <div className="mb-4">
                    Start:
                        <label className="block text-gray-700 text-sm font-light mb-2" >
                        {props.displayEvent.startdate.toLocaleString()}
                        </label>
                </div>
                <div className="mb-4">
                    End:
                        <label className="block text-gray-700 text-sm font-light mb-2" >
                        {props.displayEvent.enddate.toLocaleString()}
                        </label>
                </div>
                <div className='bottom-0 right-0'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-0 mr-0 rounded focus:outline-none focus:shadow-outline" 
                    onClick={handleClick}>X</button>
                </div>
            </div>
        </div>
      
        
    );
}
export default Calender;




