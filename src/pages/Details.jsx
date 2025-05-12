import React from 'react'
import CoinDetails from '../components/CoinDetails'
import Header from '../components/Header'

function Details() {
  return (
    <main>
      <header className=' sticky top-0 z-50'> 
        <Header/>
      </header>
      <section className='container m-auto mt-10'>
        <CoinDetails/>    
      </section>
        
    </main>
  )
}

export default Details
