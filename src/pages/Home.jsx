import React from 'react'
import AllCoins from '../components/AllCoins'
import Header from '../components/Header'
import ImagesBar from '../components/ImagesBar'
import TopMovers from '../components/TopMovers'




function HomePage() {
  return (
    <div >
     
        <div className=' sticky top-0 z-50'>
        <Header/>
      </div>
      <div className='container m-auto'>
        <TopMovers/>
      </div>
      
      <div className='container m-auto px-10 mt-10 mb-5'>
        <ImagesBar/>
      </div>
      <div className='container m-auto px-5 mt-9 '>
        <AllCoins/>
        
      </div>
     
    </div>
  )
}

export default HomePage
