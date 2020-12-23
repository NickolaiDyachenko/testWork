import { useState } from "react";
import { Observable } from "rxjs";

function App() {
  const [timeState, setTimeState] = useState({ h: 0, m: 0, s: 0 });

  const [subscriberState, setSubscriberState] = useState();

  const [isTimerActiveState, setIsTimerActiveState] = useState(false);

  const [isWaitBtnTriggered, setIsWaitBtnTriggered] = useState(false);

  const onClickResetHandler = (e) => {
    if (!isTimerActiveState) setIsTimerActiveState(!isTimerActiveState);
    if (subscriberState) subscriberState.unsubscribe();

    setTimeState({ ...timeState, h: 0, m: 0, s: 0 });

    setSubscriberState(
      createObs({ h: 0, m: 0, s: 0 }).subscribe((v) => {
        setTimeState({ ...timeState, ...v });
      })
    );
  };

  const onClickStartStopHandler = (e) => {
    if (!isTimerActiveState) {
      setSubscriberState(
        createObs(timeState).subscribe((v) => {
          setTimeState({ ...timeState, ...v });
        })
      );
    } else {
      subscriberState.unsubscribe();
      setTimeState({ ...timeState, h: 0, m: 0, s: 0 });
    }
    setIsTimerActiveState(!isTimerActiveState);
  };

  const onClickWaitHandler = (e) => {
    if (isWaitBtnTriggered) {
      if (isTimerActiveState) setIsTimerActiveState(!isTimerActiveState);
      subscriberState.unsubscribe();
    }

    setIsWaitBtnTriggered(true);

    setTimeout(() => setIsWaitBtnTriggered(false), 300);
  };

  return (
    <div className="timer">
      <div className="displayTime">
        <p className="hours">
          {timeState.h > 9 ? timeState.h : "0" + timeState.h}
        </p>
        <p className="minutes">
          {timeState.m > 9 ? timeState.m : "0" + timeState.m}
        </p>
        <p className="seconds">
          {timeState.s > 9 ? timeState.s : "0" + timeState.s}
        </p>
      </div>
      <button id="startStopButton" onClick={onClickStartStopHandler}>
        {isTimerActiveState ? "Stop" : "Start"}
      </button>
      <button id="waitButton" onClick={onClickWaitHandler}>
        Wait
      </button>
      <button id="resetButton" onClick={onClickResetHandler}>
        Reset
      </button>
    </div>
  );
}

function createObs(timeState) {
  return new Observable((subscriber) => {
    let intervalId = setInterval(() => {
      if (timeState.s >= 59) {
        timeState.m++;
        timeState.s = 0;
        if (timeState.m >= 59) {
          timeState.h++;
          timeState.m = 0;
        }
      } else timeState.s++;

      subscriber.next(timeState);
    }, 1000);

    return function unsubscribe() {
      clearInterval(intervalId);
    };
  });
}

export default App;
