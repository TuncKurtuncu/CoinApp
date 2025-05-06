import React from 'react'
import CoinDetails from '../components/CoinDetails'
import Header from '../components/Header'

function Details() {
  return (
    <div>
      <div className=' sticky top-0 z-50'> 
        <Header/>
      </div>
      <div className='container m-auto mt-10'>
        <CoinDetails/>    
      </div>
        
    </div>
  )
}

export default Details
