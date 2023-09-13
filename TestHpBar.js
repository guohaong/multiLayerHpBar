//<TestHpBar maxHp={500} />
import {useState,useEffect} from 'react'

export default function TestHpBar({maxHp}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const barColour = ['grey','red','yellow','green','purple','black','blue','cyan'];
  let numOfBar = Math.floor(maxHp/100)
  if (maxHp/100 == Math.floor(maxHp/100)){
    numOfBar = Math.floor(maxHp/100)-1
  }
  const [currentBar, setCurrentBar] = useState(numOfBar);
  const [barColour1, setBarColour1] = useState(barColour[currentBar-1]);
  const [barColour2, setBarColour2] = useState(barColour[currentBar]);
  const [width, setWidth] = useState(maxHp%100);
  const [check, setCheck] = useState(true)
  console.log(maxHp,"maxHp%100",maxHp%100)
  if (maxHp%100 == 0 && check){
    setCheck(false)
    setWidth(100);
  }

  const widthMulti = Math.floor(5);
  const [hp,setHp] = useState(maxHp); // hp%
  const [lastHp, setLastHp] = useState(maxHp);
  const [changeHp,setChangeHp] = useState(0);
  const [firstTime,setFirstTime] = useState(true); 
  const [addFlag,setAddFlag] = useState(false); 
  const [subFlag,setSubFlag] = useState(false); 
  const [inputValue, setInputValue] = useState(200);

  const ANIMATION = 'width 1s ease-out'
  const RESET_ANIMATION = 'width 0s'
  const [barTransition, setBarTransition] = useState(ANIMATION) 
  const handleInputChange = (event) => {
    setInputValue(parseInt(event.target.value));
  };

  const subHp=()=>{
    //hp = 95
    //4 colour == 75
    // hp / (100 / 4) == 3.8
    //(hp / (100/4)) - Math.floor(hp / (100/4)) == 0.8
    console.log((hp / (100/4)), Math.floor((hp / (100/4))));

    setSubFlag(true)
    //setHp(hp=>hp-inputValue)
    setChangeHp(inputValue);
  }
  const addHp=()=>{
    //setHp(hp=>hp+inputValue)
    setChangeHp(inputValue);
    setAddFlag(true)
  }

  function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  useEffect(()=>{
    if (firstTime){
      setFirstTime(false);
      setAddFlag(false)
      setSubFlag(false)
      return
    }
    if (addFlag){
      setIsDisabled(true);
      setAddFlag(false)
      setHp(hp => hp + changeHp)
      let changeLeft = changeHp;
      let currentBarHp = hp%100;
      let barNum = currentBar
      let flag = true;
      let tempWidth = width
      async function addRun() {

        while (changeLeft > 0){
         
          if (tempWidth == 100){
            console.log("IF");
            setBarTransition(RESET_ANIMATION);
            setWidth(0);
            tempWidth = 0
            barNum+=1;
            setBarColour1(barColour[barNum-1])
            setBarColour2(barColour[barNum])
            await wait(200);
            setBarTransition(ANIMATION);
          }
          else {
            console.log("ELSE",changeLeft, tempWidth);
            if (changeLeft+tempWidth >= 100){
              setWidth(100);
              changeLeft -= 100-tempWidth
              tempWidth = 100;
              await wait(1000);
            }
            else {
              setWidth(changeLeft);
              tempWidth = changeLeft
              changeLeft -= tempWidth
              await wait(1000);
            }
          }
        }
        setCurrentBar(barNum)
        setIsDisabled(false);
        console.log("width add: ",width)
      }
      addRun()
    }

    if (subFlag){
      setSubFlag(false)
      setIsDisabled(true);
      let barNum = currentBar
      let changeLeft = changeHp;
      let currentBarHp = 0;
      if (hp > 0){
        currentBarHp = hp%100;
      }
      if (currentBarHp == 0){
        currentBarHp = 100
      }
      console.log("HPCHECK", lastHp,hp)
      console.log("changeLeft= ",changeLeft)
      console.log("currentBarHp= ",currentBarHp)
      setHp(hp => hp - changeHp)

      async function run() {
        const stepSize = maxHp / (numOfBar)
        while (changeLeft > currentBarHp){
          console.log(changeLeft,currentBarHp)
          console.log("Loopy")
          changeLeft -= currentBarHp
          currentBarHp = 100
          setWidth(0)
          await wait(1000);
          console.log("wait over")
          setBarTransition(RESET_ANIMATION)
          barNum-=1;
          setBarColour1(barColour[barNum-1])
          setBarColour2(barColour[barNum])
          setWidth(100)
          await wait(200);
          setBarTransition(ANIMATION)
        }
        console.log("last");
        
        setWidth(currentBarHp-changeLeft)
        if (currentBarHp-changeLeft == 0){
          await wait(1000);
          barNum-=1;
          setBarColour1(barColour[barNum-1])
          setBarColour2(barColour[barNum])
          setBarTransition(RESET_ANIMATION)
          setWidth(100)
          await wait(200);
          setBarTransition(ANIMATION)
        }
        setCurrentBar(barNum)
        setIsDisabled(false);
        console.log("width sub: ",width)
      }
      run()
      
    }
  }, [addFlag,subFlag])
  
  return(
    <div>
      <div>hp = {hp}</div>
      <button onClick={subHp} disabled={isDisabled}>-</button>
      <button onClick={addHp} disabled={isDisabled}>+</button>
      <input id="my-input" type="text" value={inputValue} onChange={handleInputChange} />
      <div id="bar1" style={{position:'absolute',width:'500px', backgroundColor:barColour1,transition: 'width 1s ease-out'}}>
        &nbsp;
      </div>
      <div id="bar2" style={{position:'absolute',width:(width*widthMulti)+'px', backgroundColor:barColour2,transition: barTransition}}>
        &nbsp;
      </div>
    </div>
  )
}