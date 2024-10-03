import React, { useEffect, useState } from 'react';
import './Results.css';

const Results = () => {
  const [users, setUsers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isBiddingActive, setIsBiddingActive] = useState(false);

  useEffect(() => {
    const checkBiddingStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday
      const hour = now.getHours();
      const minutes = now.getMinutes();

      // Check if it's Friday (5) and time is between 12 AM and 4 PM (0 - 15)
      if (day === 5 && (hour < 16)) {
        setIsBiddingActive(true);
      } else {
        setIsBiddingActive(false);
      }
    };

    checkBiddingStatus();
    
    // Fetch data only if bidding is not active
    if (!isBiddingActive) {
      fetchData();
    }

    // Optionally, set an interval to check the time periodically
    const interval = setInterval(checkBiddingStatus, 60000); // Check every minute
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [isBiddingActive]);

  // Function to fetch data from Google Sheets
  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://v1.nocodeapi.com/bernie85/google_sheets/yfsQONnsCROTREgu?tabId=Sheet2',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      if (data && data.data) {
        const entries = data.data.map((entry) => {
          return {
            name: entry['Name'] || 'No Name',
            email: entry['Email'] || 'No Email',
            phoneNumber: entry['Phone Number'] || entry['Phone'] || 'No Phone',
            bid: parseInt(entry['Bid'], 10) || 0,
            timestamp: entry['Timestamp'] || entry['Date/Time'] || 'No Timestamp',
          };
        });

        // Set the users data and determine the winner
        setUsers(entries);
        determineWinner(entries);
      } else {
        console.error('Invalid data structure:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to determine the winner based on the lowest unique bid
  const determineWinner = (users) => {
    const bidCounts = users.reduce((acc, user) => {
      acc[user.bid] = (acc[user.bid] || 0) + 1;
      return acc;
    }, {});

    // Get unique bids (where count is 1)
    const uniqueBids = Object.keys(bidCounts).filter((bid) => bidCounts[bid] === 1);

    if (uniqueBids.length === 0) return; // No unique bids found

    // Find the lowest unique bid
    const lowestUniqueBid = Math.min(...uniqueBids.map(Number));

    // Set the winner (user with the lowest unique bid)
    const winningUser = users.find((user) => user.bid === lowestUniqueBid);
    setWinner(winningUser);
  };

  // Helper functions to mask email and phone numbers
  const maskEmail = (email) => {
    if (!email || email.indexOf('@') === -1) return email;
    const emailName = email.split('@')[0];
    const domain = email.split('@')[1] || 'gmail.com';
    return `${emailName.substring(0, 3)}***@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone || phone.length < 6) return phone;
    const firstThree = phone.substring(0, 3);
    const lastThree = phone.substring(phone.length - 3);
    return `${firstThree}****${lastThree}`;
  };

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="results-container">
      <h1>Bidding Results</h1>
      {isBiddingActive ? (
        <p>Bidding is still ongoing. Check back after 4 PM for results.</p>
      ) : (
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
            {/* Sort users to show the winner at the top */}
            {[winner, ...users.filter((user) => user !== winner)].map((user, index) => (
              <tr key={index} className={user === winner ? 'winner-row' : ''}>
                <td>{user?.name || 'N/A'}</td>
                <td>{maskEmail(user?.email) || 'N/A'}</td>
                <td>{maskPhone(user?.phoneNumber) || 'N/A'}</td>
                <td>₦{user?.bid || 'N/A'}</td>
                <td>{user?.timestamp || 'N/A'}</td>
                <td>{user === winner ? 'Winner' : 'Come back next week Friday'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Scroll to Top Button */}
      <button className="scroll-to-top" onClick={scrollToTop}>
        Scroll to Top
      </button>
    </div>
  );
};

export default Results;
