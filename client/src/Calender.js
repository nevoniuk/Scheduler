import React, {useState, useCallback, useEffect} from 'react';
import './Calender.css';
import NavBar from './Components/Navbar'
import SideBar from './Components/SideBar'
/**
 * 1. Front end queries with dates in UTC time
 * 2. Front end receives responses in UTC time and converts to local time
 */

const Days = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"]
let days = []
var currdate = new Date()
var currstartdate = new Date()
currstartdate.setDate(currstartdate.getDate() - 7)

function Calender(props) { 
    const date = new Date('March 14, 23 16:00')
    const date3 = new Date('March 14, 23 21:20')
    const [eventsChanged, setEventsChanged] = useState(false)
    const [addedDays, setDays] = useState(false)
    const [arrow, setArrow] = useState("")
    const [endDate, setEndDate] = useState(currdate)
    const [startDate, setStartDate] = useState(currstartdate)
    console.log(startDate)
    console.log(endDate)
    let dayEvents = []

    function arrowChanged(e) {
        setArrow(e.target.getAttribute('keyValue'))
        changeHours()
    }
    function changeHours() {
        if (arrow === "forward") {
            console.log("forward")
            setStartDate(endDate)
            var newEnd = new Date()
            newEnd.setDate(endDate.getDate() + 7)
            setEndDate(newEnd)
        }
        else if (arrow === "back") {
            console.log("back")
            setEndDate(startDate)
            var newStart = new Date()
            newStart.setDate(startDate.getDate() - 7)
            setStartDate(newStart)
            
        }
        console.log("new is " + startDate)
        console.log("new is " + endDate)
    }

    useEffect(() => {
        //setEventsChanged(false)
        //loadEvents()
        console.log(startDate)
        console.log(endDate)
    }, [startDate, endDate])

    const onEventsChanged = () => {
        setEventsChanged(true)
    };
    useEffect(() => {//triggers rerender when events have changed
        setEventsChanged(false)
        loadEvents()
    }, [eventsChanged])

    useEffect( ()=> { //triggers rerender when days array is finished
    }, [addedDays])

    async function loadEvents() { //loads all the events for a given week(hardcoded week range)
       // console.log(date)
        //console.log(date3)
        let res = []
        let url = 'http://localhost:3002/events/?startDate=' + date.toUTCString() + '&endDate=' + date3.toUTCString()
         const p = (await fetch(url,
         {
             method: 'GET',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': 'Bearer ' + localStorage.getItem('token')
               },
         }).then(async data => {
            res = await data.json();
            if (data.status !== 200) {
              throw new Error(data.statusText)
            } else {
              dayEvents = res
              var startDate = new Date(date)
              var endDate = new Date(date3)
              createDays(startDate, endDate)
            }
            
        }).catch(err => console.log(err))) 
    }
    
    /** Creates an array of day objects that contain corresponding events and converts UTC to local*/
   function createDays(startDate, endDate) {
        days = []
        let start = new Date(dayEvents[0].startdate)
        var offset = start.getTimezoneOffset() / 60
        start.setHours(start.getHours() - offset)

        for (let i = 0; i < dayEvents.length; i++) {
            let event = dayEvents[i]
            var d1 = new Date(event.startdate)
            var d2 = new Date(event.enddate) 
            d1.setHours(d1.getHours() - offset)  
            d2.setHours(d2.getHours() - offset)
            event.startdate = d1
            event.enddate = d2
            //console.log("start is " + event.startdate) 
           // console.log("end is " +event.enddate)       
            let index = event.startdate.getDate() - start.getDate()
            
            if (days[index] === undefined) {
                
                days[index] = {
                    "name": Days[event.startdate.getDay()],
                    "numevents": 0,
                    "Events": []
                }
            }
            let arr = days[index].Events
            days[index].numevents = days[index].numevents + 1;
            arr.push(event)
        }
        //now fill in days with no events
        let day = start.getDate()
        let startday = day
        let lastday = day + 7
      
      
        while (day <= lastday) {
            let index = day - startday
            if (days[index] == undefined) {
                //TODO implement logic in case month changed or year changed
                start.setDate(day)
                days[index] = {
                    "name": Days[start.getDay()], 
                    "numevents": 0,
                    "Events": []
                }
            }
            days[index].date = new Date(start.setDate(day)).toLocaleDateString()
            day = day + 1
        }
        setDays(true)
    }

    return (
        <div className='body'>
            <div className='Container'>
                <NavBar startDate={startDate} endDate={endDate} arrowChanged={arrowChanged}/>
                <div className='ContainerOne'>
                    <SideBar onEventsChanged={onEventsChanged}/>
                        {addedDays && 
                            <div className='Day-Names'>
                                {days.map((_, index) => (
                                <div key={index} className='Day-Title'>{days[index].name +"\n"+ days[index].date}</div>
                                ))}
                            </div>}
                    {addedDays && 
                    <div className='WeekView'>
                            {days.map((_, index) => (
                                <Day key={index} day={days[index]}/>
                            ))}
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
    let rowEndTimes = [] //contains each row with events
    let hours  = Array.apply(null, Array(25))
   
 
    while (i < events.length) {
        var start = events[i].startdate
        let j = 0
        for (j = 0; j < rowEndTimes.length; j++) { //search which row to place the event
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

function EventRow({events, handleDisplayEvent}) { //calculate offset at the start time of the first hour
    
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
    }

    for (let i = 0; i < events.length; i++) {
        var diff = (events[i].enddate - events[i].startdate)
 
        var t = (diff / total) * 100
        const style = {
            flexBasis: '' + (t) +'%',
            backgroundColor: '#a0a7be',
            borderRadius: '1px'
        }
        styles.push(style)
    }
//one popup per row
//
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



