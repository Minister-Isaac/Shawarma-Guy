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
          'https://v1.nocodeapi.com/minister18/google_sheets/iQxNLtNaJzVLrwFk?tabId=Sheet1',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();

        if (data && data.data) {
          // Map the data from Google Sheets using the correct column names
          const entries = data.data.map((entry) => {
            return {
              name: entry['Name'] || 'No Name', // Check if the Name column is correctly set
              email: entry['Email'] || 'No Email', // Check if the Email column is correctly set
              phoneNumber: entry['Phone Number'] || entry['Phone'] || 'No Phone', // Adjust based on actual Google Sheet column
              bid: parseInt(entry['Bid'], 10) || 0, // Parse bid as integer
              timestamp: entry['Timestamp'] || entry['Date/Time'] || 'No Timestamp', // Ensure correct timestamp field
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

    fetchData();
  }, []);

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

  // Helper function to mask email
  const maskEmail = (email) => {
    if (!email || email.indexOf('@') === -1) return email; // Handle invalid emails
    const emailName = email.split('@')[0]; // Get the part before the @ symbol
    const domain = email.split('@')[1] || 'gmail.com'; // Set the domain, default to gmail.com
    return `${emailName.substring(0, 3)}***@${domain}`; // Mask the email
  };

  // Helper function to mask phone number
  const maskPhone = (phone) => {
    if (!phone || phone.length < 6) return phone; // Handle invalid phone numbers
    const firstThree = phone.substring(0, 3); // First 3 digits
    const lastThree = phone.substring(phone.length - 3); // Last 3 digits
    return `${firstThree}****${lastThree}`; // Mask the middle digits
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
          {/* Sort users to show the winner at the top */}
          {[winner, ...users.filter((user) => user !== winner)].map((user, index) => (
            <tr key={index}>
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
    </div>
  );
};

export default Results;
