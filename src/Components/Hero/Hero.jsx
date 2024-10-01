import React, { useState, useEffect } from 'react';
import './Hero.css';
import Shawarma2 from '../../assets/Shawama2.jpg';

const Hero = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bid: '',
  });

  const { name, email, phoneNumber, bid } = formData;

  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showComebackMessage, setShowComebackMessage] = useState(false);
  const [manualToggle, setManualToggle] = useState(true);
  const [isBiddingOpen, setIsBiddingOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    const day = today.getDay(); // 5 = Friday
    const hours = today.getHours();

    if (day === 5 && hours >= 0 && hours < 16) {
      setIsBiddingOpen(true);
    } else {
      setIsBiddingOpen(false);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateBid = (bid) => {
    const bidValue = parseInt(bid, 10);
    if (isNaN(bidValue) || bidValue < 1 || bidValue > 3000) {
      return 'Your bid must be between ₦1 and ₦3000.';
    }
    return null;
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    const bidError = validateBid(formData.bid);
    if (bidError) {
      setError(bidError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://v1.nocodeapi.com/bernie85/google_sheets/yfsQONnsCROTREgu?tabId=Sheet1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([[name, email, phoneNumber, bid, new Date().toLocaleString()]]),
        }
      );

      await response.json();
      setFormData({ name: '', email: '', phoneNumber: '', bid: '' });

      if (response.ok) {
        setBidSubmitted(true);
        setTimeout(() => {
          setShowComebackMessage(true);
          setBidSubmitted(false);
        }, 600000);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://v1.nocodeapi.com/bernie85/google_sheets/beItPGXozDYCIetN?tabId=Sheet1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([[email, new Date().toLocaleString()]]),
        }
      );

      await response.json();
      setFormData({ ...formData, email: '' });

      if (response.ok) {
        alert('Email submitted successfully!');
      }
    } catch (err) {
      setError('An error occurred while submitting your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showFormOrMessage = () => {
    if (manualToggle) {
      return !isBiddingOpen;
    }
    return isBiddingOpen;
  };

  if (showComebackMessage) {
    return (
      <div className='hero-container'>
        <div className='hero-left'>
          <h1>Shawarma Love + Creamy Bliss</h1>
          <img src={Shawarma2} alt='Shawarma' />
        </div>
        <div className='hero-success'>
          <h1>Comeback next Friday for your next bid!</h1>
        </div>
      </div>
    );
  }

  if (bidSubmitted) {
    return (
      <div className='hero-container'>
        <div className='hero-left'>
          <h1>Shawarma Love + Creamy Bliss</h1>
          <img src={Shawarma2} alt='Shawarma' />
        </div>
        <div className='hero-success'>
          <h1>🎉 Congratulations!</h1>
          <p>Your bid has been successfully placed.</p>
          <p>Come back next Friday!</p>
        </div>
      </div>
    );
  }

  return (
    <div className='hero-container'>
      <div className='hero-left'>
        <h1>Get shawarma for as low as ₦1</h1>
        <img src={Shawarma2} alt='Shawarma' />
      </div>
      <div className='hero-right'>
        {showFormOrMessage() ? (
          <>
            <h1>Place Your Bid</h1>
            <form className='hero-form' onSubmit={handleSubmitBid} aria-live="assertive">
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

              <label>Your Whatsapp number:</label>
              <input
                placeholder='Whatsapp Number'
                name='phoneNumber'
                type='text'
                value={phoneNumber}
                onChange={handleInputChange}
                required
              />

              <label>Place your bid:</label>
              <input
                placeholder='Bid amount must be a whole number between ₦1 - ₦3000'
                name='bid'
                type='text'
                value={bid}
                onChange={handleInputChange}
                required
              />

              <button className='hero-btn' type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="spinner"></span> // Loading spinner
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className='hero-disabled'>
            <h3>Hello and welcome to the Shawarma Guy online bid</h3>
            <ol>
              <li>This page is opened for bidding every Friday from midnight to 4pm</li>
              <li>Fill the form when the bid is live and put in a whole number between ₦1 - ₦3000 </li>
              <li>The lowest unique bid wins</li>
              <li>Pay the bid amount and get the Shawarma and Milkshake combo</li>
            </ol>
            <form onSubmit={handleSubmitEmail}>
              <label>Input your Email:</label><br />
              <input
                placeholder='Email'
                name='email'
                type='email'
                value={email}
                onChange={handleInputChange}
                required
              />
              <button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="spinner"></span> // Loading spinner
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
