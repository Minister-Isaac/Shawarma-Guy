import React, { useState, useEffect } from 'react';
import './Navbar.css';
import Shawama from '../../assets/Shawama.jpg';

const Navbar = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isBiddingPeriod, setIsBiddingPeriod] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 is Sunday, 5 is Friday
      const currentTime = now.getTime();

      // If it's Friday and between 12 AM to 4 PM, count down to 4 PM
      if (currentDay === 5) {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
        const fourPm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0).getTime();

        if (currentTime >= startOfDay && currentTime <= fourPm) {
          const timeRemaining = fourPm - currentTime;
          setIsBiddingPeriod(true); // It's currently the bidding period
          setTimeLeft(formatTime(timeRemaining)); // Countdown to 4 PM
          return;
        }
      }

      // If it's not Friday or it's past 4 PM, count down to the next Friday 12 AM
      setIsBiddingPeriod(false);
      const nextFriday = getNextFriday();
      const timeRemaining = nextFriday - currentTime;
      setTimeLeft(formatTime(timeRemaining)); // Countdown to the next Friday
    };

    const intervalId = setInterval(updateTimer, 1000); // Update every second
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  // Calculate the timestamp for the next Friday at 12 AM
  const getNextFriday = () => {
    const now = new Date();
    const nextFriday = new Date();

    // If today is Friday after 4 PM, set next Friday
    if (now.getDay() === 5 && now.getHours() >= 16) {
      nextFriday.setDate(now.getDate() + 7);
    } else {
      nextFriday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7));
    }

    nextFriday.setHours(0, 0, 0, 0); // Set to Friday 12:00 AM
    return nextFriday.getTime();
  };

  // Format the remaining time into days, hours, minutes, seconds
  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="bid-navbar">
      <img src={Shawama} height={100} width={100} alt="Shawarma Guy" />
      <h1>The Shawarma Guy</h1>
      <div className="timer-container">
        <h1>{isBiddingPeriod ? 'Bidding Period!' : 'Next Bidding'}</h1>
        <h2>{timeLeft}</h2>
      </div>
    </div>
  );
};

export default Navbar;
