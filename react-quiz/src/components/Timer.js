import React, { useEffect } from 'react'

function Timer({dispatch, secondsRemaining}) {
    const mins = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    useEffect(()=>{
      const id = setInterval(()=>{
        dispatch({type: 'tick'})
      }, 1000)
      return() => clearInterval(id);
    },[dispatch])
  return (
    <div className='timer'>{mins > 9 ? mins : `0${mins}`} : {seconds > 9 ? seconds : `0${seconds}`}</div>
  )
}

export default Timer