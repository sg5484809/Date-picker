import { useState } from 'react';
import { addDays, format, isAfter, isBefore, isSameDay } from "date-fns";

const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function Rdp(){
  let [freq,setfreq] = useState("daily");
  let [interval,setinterval] = useState(1);
  let [selectDay,setselectday] = useState([]);
  let [startdate,setstartdate] = useState("");
  let [end,setend] = useState("");
  const toggle_D =(day)=>{
    if(selectDay.includes(day)){
      setselectday(selectDay.filter((d)=> d!= day))
    }
    else{
      setselectday([...selectDay,day]);
    }
  }
  const create_D = ()=>{
    const result = [];
    let current = new Date(startdate);
    let until = end ? new Date(end) : addDays(new Date(startdate),60);
    while(isBefore(current,until) || isSameDay(current,until)){
      switch(freq){
        case "daily":
          result.push(new Date(current));
          current = addDays(current,interval);
          break;
        case "weekly":
          weekdays.forEach((day,i)=>{
            if(selectDay.includes(day)){
              const next = new Date(current);
              next.setDate(current.getDate()+((i-next.getDay()+7)%7));
              if((isBefore(next,until) || isSameDay(next,until)) && isAfter(next, new Date(startdate))){
                result.push(new Date(next));
              }
            }
          })
          current = addDays(current,7*interval);
          break;
        case "monthly":
          const temp = new Date(current);
          temp.setMonth(temp.getMonth()+interval);
          result.push(new Date(current));
          current = temp;
          break;
        case "yearly":
          result.push(new Date(current));
          current.setFullYear(current.getFullYear()+interval);
          break;
        default:
          break;
      }
    }
    return result;
  }
  return (
    <div className='p-6 max-w-xl bg-white shadow-xl rounded-xl space-y-4'>
      <h1 className='text-2xl font-semibold text-red-600'>Recurring Date Picker</h1>
      <div className='space-y-2'>
        <label className='font-semibold'>Frequency</label>
        <div className='flex gap-2 flex-wrap'>
          {["daily","weekly","monthly","yearly"].map((fre)=>(
            <button key={fre} onClick={()=>setfreq(fre)} className={`px-3 py-1 rounded-full border ${freq === fre? "bg-blue-500":"bg-gray-100"}`}>
              {fre.charAt(0).toUpperCase()+fre.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label>Every</label>
        <input type='number' className='border ml-2 rounded w-20' value={interval} onChange={(e)=> setinterval(parseInt(e.target.value))} min={1}/>
        <span className='ml-2'>
          {freq === "daily"?"day(s)": freq === "weekly"?"week(s)": freq === "monthly"?"month(s)":"year(s)"}
        </span>
      </div>
      {freq === "weekly" &&(
        <div>
          <label>Select Days of week:</label>
          <div className='flex flex-wrap gap-2 mt-2'>
            {weekdays.map((day)=>(
              <button key={day} onClick={()=>toggle_D(day)} className={`px-4 py-1 rounded-full border ${selectDay.includes(day)? "bg-green-500":"bg-gray-100"}`}>
                {day.slice(0,3)}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className='flex gap-4'>
        <div>
          <label>Start Date: </label>
          <input type='date' className='border p-1 rounded' value={startdate} onChange={(e)=>setstartdate(e.target.value)}/>
        </div>
        <div>
          <label>End Date: </label>
          <input type='date' className='border p-1 rounded' value={end} onChange={(e)=>setend(e.target.value)}/>
        </div>
      </div>
      <div>
        <h2 className='font-semibold mt-4'>Preview</h2>
        <ul className='list-inside max-h-40 overflow-auto text-sm'>
          {create_D().map((date,i)=>(
            <li key={i}>{format(date, "yyyy-MM-dd")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Rdp;