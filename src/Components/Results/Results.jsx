import React, { useEffect, useState } from 'react';
import './Results.css';

const Results = () => {
  const [users, setUsers] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // Fetch data from Google Sheets
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://v1.nocodeapi.com/minister18/google_sheets/iQxNLtNaJzVLrwFk?tabId=Sheet1'
        );
        const data = await response.json();

        const currentTime = new Date();
        const currentDay = currentTime.getDay();
        const currentHour = currentTime.getHours();

        const entries = data.map((entry) => ({
          name: entry.name,
          email: entry.email,
          phoneNumber: entry.phoneNumber,
          bid: parseInt(entry.bid, 10),
          timestamp: entry.timestamp || new Date().toLocaleString(), // Add timestamp
        }));

        setUsers(entries);
        determineWinner(entries); // Determine the winner upon data fetch

        // Check if the current time is before or after 4 PM on Friday (day 5)
        if (currentDay === 5 && currentHour >= 16) {
          // Fetch and display current week's bids
          const currentBids = entries.filter(entry => {
            const bidTime = new Date(entry.timestamp);
            return bidTime >= new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() - currentDay + 5, 16);
          });
          setUsers(currentBids);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to find the lowest unique bid
  const determineWinner = (users) => {
    const bidCounts = users.reduce((acc, user) => {
      acc[user.bid] = (acc[user.bid] || 0) + 1;
      return acc;
    }, {});

    // Get unique bids (where count is 1)
    const uniqueBids = Object.keys(bidCounts).filter(bid => bidCounts[bid] === 1);

    // Find the lowest unique bid
    const lowestUniqueBid = Math.min(...uniqueBids.map(Number));

    // Set the winner (user with the lowest unique bid)
    const winningUser = users.find(user => user.bid === lowestUniqueBid);
    setWinner(winningUser);
  };

  return (
    <div className="results-container">
      <h1>Bidding Results</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Bid Amount</th>
            <th>Date/Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>₦{user.bid}</td>
              <td>{user.timestamp}</td>
              <td>{user === winner ? 'Winner' : 'Come back next week Friday'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
