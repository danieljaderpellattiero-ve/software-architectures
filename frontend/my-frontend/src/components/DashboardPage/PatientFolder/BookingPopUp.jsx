import React from 'react'

const BookingPopUp = () => {
  return (
    <div className='Overlay'>
        <div className='Popup container'>
            <img src='https://via.placeholder.com/150' alt='Doctor' />
            <span className='confimation messafe'> Selected Doctor will reply to your request within 48 hours </span>

        </div>
    </div>
  )
}

export default BookingPopUp