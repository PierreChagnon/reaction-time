import React, { useState, useEffect } from 'react';
import './App.css';

import Timer from './Timer';

function App() {

  const lights = ["light1", "light2", "light3", "light4"]
  const panels = ["panel1", "panel2", "panel3", "panel4", "panel5"]
  let count = 1
  const [time, setTime] = useState(0)
  const [score, setScore] = useState(0)
  let firedInterval
  let turnoffInterval
  const [isActive, setIsActive] = useState(false) //true when lights out
  let ongoing = false //to know if starting procedure is under way
  const lightsOutDelay = Math.floor(Math.random() * (7000 - 4000) + 4000)
  const start = new Date().getTime();

  const handleKeyDown = (event) => {
    // console.log('A key was pressed', event.keyCode);
    if (event.keyCode === 32) {
      if (score > 0) {
        setScore(0)
      } else {
        clickHandler();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  useEffect(() => {
    let interval = null;
    if (isActive === true) {
      interval = setInterval(() => {
        //pour calculer à la ms près (sinon les navigateurs sont bridés)
        const now = new Date().getTime();
        setTime((now - start));
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const fireLight = () => {
    const panel = document.getElementById("panel" + count)
    const lights = [panel.children[2], panel.children[3]]
    lights[0].classList.add("fired")
    lights[1].classList.add("fired")

    count++

    if (count > 5) {
      //reset count and turn off lights after delay
      count = 1
      clearInterval(firedInterval)
      turnoffInterval = setInterval(turnoff, lightsOutDelay)
      // console.log("delay = " + lightsOutDelay)
    }
  }

  const turnoff = () => {
    //turn off lights
    for (let i = 1; i < 6; i++) {
      const element = document.getElementById("panel" + i)
      const lights = [element.children[2], element.children[3]]
      lights[0].classList.remove("fired")
      lights[1].classList.remove("fired")
    }

    clearInterval(turnoffInterval)
    setIsActive(true)
    // console.log("isActive = " + isActive)

  }

  const clickHandler = () => {

    if (ongoing === false && isActive === false) {
      // console.log("fired", "ongoing = " + ongoing)
      ongoing = true
      // console.log("ongoing = " + ongoing)
      firedInterval = setInterval(fireLight, 1000)

    } else if (isActive) {
      // console.log("votre temps de reaction est de " + time)
      setIsActive(false)
      setTime(0)
      setScore(time)
      ongoing = false

    } else {
      //jumpstart : reset all
      // console.log("error/jumpstart")
      clearInterval(turnoffInterval)
      clearInterval(firedInterval)
      ongoing = false
      setIsActive(false)
      setTime(0)
      setScore(0)
      count = 1
      //turn off lights
      for (let i = 1; i < 6; i++) {
        const element = document.getElementById("panel" + i)
        const lights = [element.children[2], element.children[3]]
        lights[0].classList.remove("fired")
        lights[1].classList.remove("fired")
      }
    }
  }

  return (
    <div className="container">
      <h1 style={{color: "white"}}>Test your reaction time</h1>
      <h3 style={{color: "lightgray", fontWeight: "lighter"}}>Press spacebar to play</h3>
      <div className="panel-container">
        <div className="bar"></div>
        {panels.map((i) => {
          return <div key={i} id={i} className="panel">
            {lights.map((i) => {
              return <div key={i} id={i} className="light"></div>
            })}
          </div>
        })}

      </div>
      <Timer time={score} />
    </div>
  );
}

export default App;
