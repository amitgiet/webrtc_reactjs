import React, { useEffect, useState } from "react";
import "./screenRecorder/screenRecorder.scss";
const Countdown = ({ cb }) => {
  const [count, setCount] = useState(3);
  useEffect(() => {
    let isMounted = true;
    let timer;
    [2, 1].map(
      (value, index) =>
        isMounted &&
        setTimeout(() => {
          setCount(value);
          if (value === 1)
            timer = setTimeout(() => {
              isMounted && cb();
            }, 1000);
        }, (index + 1) * 1000)
    );
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="countdown-container">
      <p> {count}</p>
    </div>
  );
};

export default Countdown;
