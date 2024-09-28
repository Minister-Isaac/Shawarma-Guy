import React, { useState, useEffect } from 'react';
import './Hero.css';
import Shawarma2 from '../../assets/Shawama2.jpg';

const Hero = () => {
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bid: '',
  });

  const { name, email, phoneNumber, bid } = formData;

  // State for bid submission, errors, and manual toggling
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showComebackMessage, setShowComebackMessage] = useState(false);

  // Manual toggle state
  const [manualToggle, setManualToggle] = useState(false);

  // Automatic toggling based on time frame (Friday 12am-4pm)
  const [isBiddingOpen, setIsBiddingOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    const day = today.getDay(); // 5 = Friday
    const hours = today.getHours(); // Get the current hour

    // Check if the current time is within Friday 12am-4pm
    if (day === 5 && hours >= 0 && hours < 16) {
      setIsBiddingOpen(true);
    } else {
      setIsBiddingOpen(false);
    }
  }, []);

  // Handles changes in form input fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to validate bid input
  const validateBid = (bid) => {
    const bidValue = parseInt(bid, 10);
    if (isNaN(bidValue) || bidValue < 1 || bidValue > 3000) {
      return 'Your bid must be between ₦1 and ₦3000.';
    }
    return null;
  };

  // Form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    const bidError = validateBid(formData.bid);
    if (bidError) {
      setError(bidError);
      return;
    }

    setError(null); // Clear any existing error
    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://v1.nocodeapi.com/minister18/google_sheets/iQxNLtNaJzVLrwFk?tabId=Sheet1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            [name, email, phoneNumber, bid, new Date().toLocaleString()],
          ]),
        }
      );

      await response.json();
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        bid: '',
      });

      // Check if the response is successful
      if (response.ok) {
        setBidSubmitted(true);
        // Set a timer to show the comeback message after 10 minutes
        setTimeout(() => {
          setShowComebackMessage(true);
          setBidSubmitted(false); // Reset bid submitted state
        }, 600000); // 10 minutes
      }

      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
    }
  };

  // Manual override (force toggle between bid form and comeback message)
  const showFormOrMessage = () => {
    if (manualToggle) {
      return !isBiddingOpen; // If manually toggled, show the opposite of bidding state
    }
    return isBiddingOpen;
  };

  if (showComebackMessage) {
    return (
      <div className='hero-container'>
        <div className='hero-left'>
          <h1>Shawarma Haven</h1>
          <img src={Shawarma2} alt='Shawarma' />
        </div>
        <div className='hero-success'>
          <h1>Comeback next week Friday for your next bid!</h1>
        </div>
      </div>
    );
  }

  if (bidSubmitted) {
    return (
      <div className='hero-container'>
        <div className='hero-left'>
          <h1>Shawarma Haven</h1>
          <img src={Shawarma2} alt='Shawarma' />
        </div>
        <div className='hero-success'>
          <h1>🎉 Congratulations!</h1>
          <p>Your bid has been successfully placed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='hero-container'>
      <div className='hero-left'>
        <h1>Shawarma Haven</h1>
        <img src={Shawarma2} alt='Shawarma' />
      </div>
      <div className='hero-right'>
        {showFormOrMessage() ? (
          <>
            <h1>Place Your Bid</h1>
            <form className='hero-form' onSubmit={handleSubmit}>
              {error && <p style={{ color: 'red' }}>{error}</p>}

              <label>Your Name:</label>
              <input
                placeholder='Name'
                name='name'
                type='text'
                value={name}
                onChange={handleInputChange}
                required
              />

              <label>Your Email:</label>
              <input
                placeholder='Email'
                name='email'
                type='email'
                value={email}
                onChange={handleInputChange}
                required
              />

              <label>Your phone number:</label>
              <input
                placeholder='Phone Number'
                name='phoneNumber'
                type='text'
                value={phoneNumber}
                onChange={handleInputChange}
                required
              />

              <label>Place your bid:</label>
              <input
                placeholder='Bid amount must be between ₦1 - ₦3000'
                name='bid'
                type='text'
                value={bid}
                onChange={handleInputChange}
                required
              />

              <button className='hero-btn' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </>
        ) : (
          <div className='hero-disabled'>
            <h1>Come back next week Friday!</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;









































// import React, { useState } from 'react';
// import "./Hero.css";
// import Shawarma2 from "../../assets/Shawama2.jpg";

// const Hero = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phoneNumber: '',
//     bid: '',
//     code: '' 
//   });

//   const [codeSent, setCodeSent] = useState(false);
//   const [generatedCode, setGeneratedCode] = useState(null); 
//   const [bidSubmitted, setBidSubmitted] = useState(false); 
//   const [isFormVisible, setIsFormVisible] = useState(false); 
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isVerified, setIsVerified] = useState(false); // 

//   // Handles changes in form input fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Function to validate bid input
//   const validateBid = (bid) => {
//     const bidValue = parseInt(bid, 10);
//     if (isNaN(bidValue) || bidValue < 1 || bidValue > 3000) {
//       return "Your bid must be between ₦1 and ₦3000.";
//     }
//     return null;
//   };

//   // Function to send WhatsApp OTP (replace with backend API call)
//   const sendWhatsAppCode = () => {
//     // Validate phone number format
//     const phoneRegex = /^[0-9]{10,15}$/;
//     if (!phoneRegex.test(formData.phoneNumber)) {
//       alert("Please enter a valid phone number.");
//       return;
//     }

//     // Example OTP generation, this should be replaced with an actual API call to send OTP
//     const newCode = Math.floor(1000 + Math.random() * 9000); 
//     setGeneratedCode(newCode); 

//     setCodeSent(true);

//     // Simulated backend API call to send OTP to WhatsApp
//     fetch("/api/send-whatsapp-otp", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ phoneNumber: formData.phoneNumber, code: newCode }),
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         alert("OTP has been sent to your WhatsApp number!");
//       } else {
//         alert("Failed to send OTP. Please try again.");
//         setCodeSent(false); 
//       }
//     })
//     .catch((error) => {
//       console.error("Error sending OTP:", error);
//       alert("Error sending OTP.");
//       setCodeSent(false); 
//     });
//   };

//   // Function to verify the OTP entered by the user
//   const verifyOTP = () => {
//     if (formData.code === generatedCode?.toString()) {
//       setIsVerified(true); // OTP is correct
//     } else {
//       alert("The OTP code is incorrect.");
//       setIsVerified(false); // Reset verification status if incorrect
//     }
//   };

//   // Handles form submission
//   const submitForm = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Check if OTP is verified before allowing form submission
//     if (!isVerified) {
//       alert("Please verify your OTP before submitting.");
//       setIsSubmitting(false);
//       return;
//     }

//     const bidError = validateBid(formData.bid);
//     if (bidError) {
//       alert(bidError);
//       setIsSubmitting(false);
//       return;
//     }

//     // Send the form data to the Google Sheets
//     const formEle = document.querySelector("hero-form");
//     const formDatab = new FormData(formEle);

//     fetch(
//       "https://script.google.com/macros/s/AKfycbw-4kW0QnjKCNz03SwGOCLyydDGEeZrafCXaQ_6bPzSPJpV2_LZ4sx009j8i46V10MgzA/exec",
//       {
//         method: "POST",
//         body: formDatab, 
//       }
//     )
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//       setBidSubmitted(true); 
//       setIsSubmitting(false);
//       setFormData({
//         name: '',
//         email: '',
//         phoneNumber: '',
//         bid: '',
//         code: ''
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       alert("Error submitting bid.");
//       setIsSubmitting(false);
//     });
//   };

//   if (bidSubmitted) {
//     return (
//       <div className='hero-container'>
//         <div className="hero-left">
//           <h1>The Shawarma Guy</h1>
//           <img src={Shawarma2} alt="Shawarma" />
//         </div>
//         <div className="hero-success">
//           <h1>🎉 Congratulations!</h1>
//           <p>Your bid has been successfully placed.</p>
//           <p>Come back next week on Friday to bid again.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className='hero-container'>
//       <div className="hero-left">
//         <h1>The Shawarma Guy</h1>
//         <img src={Shawarma2} alt="Shawarma" />
//       </div>
//       <div className="hero-right">
//         <h1>Place Your Bid</h1>
//         {isFormVisible ? (
//           <form className='hero-form' onSubmit={submitForm}>
//             <label>Your Name:</label>
//             <input
//               placeholder='Name'
//               name='name'
//               type='text'
//               value={formData.name}
//               onChange={handleInputChange}
//               required
//             />

//             <label>Your Email:</label>
//             <input
//               placeholder='Email'
//               name='email'
//               type='email'
//               value={formData.email}
//               onChange={handleInputChange}
//               required
//             />

//             <label>Your phone number:</label>
//             <input
//               placeholder='Phone Number'
//               name='phoneNumber'
//               type='text'
//               value={formData.phoneNumber}
//               onChange={handleInputChange}
//               required
//             />

//             <button 
//               type='button' 
//               onClick={sendWhatsAppCode} 
//               className='hero-btn'
//               disabled={codeSent}
//             >
//               {codeSent ? "OTP Sent" : "Verify"}
//             </button>

//             {codeSent && (
//               <>
//                 <label>Enter the code sent to WhatsApp:</label>
//                 <input
//                   placeholder='Enter code'
//                   name='code'
//                   type='text'
//                   value={formData.code}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 <button type="button" onClick={verifyOTP} className="hero-btn">
//                   Verify OTP
//                 </button>
//                 {isVerified && <p>✅ OTP Verified</p>} {/* Shows if OTP is verified */}
//               </>
//             )}

//             <label>Place your bid:</label>
//             <input
//               placeholder='Bid amount must be between ₦1 - ₦3000'
//               name='bid'
//               type='text'
//               value={formData.bid}
//               onChange={handleInputChange}
//               required
//             />

//             <button className='hero-btn' type='submit' disabled={isSubmitting || !isVerified}>
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>
//           </form>
//         ) : (
//           <div className="hero-disabled">
//             <p>Bidding is only allowed on Fridays. Please come back then!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Hero;
