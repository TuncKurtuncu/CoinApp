import React from 'react'
import AllCoins from '../components/AllCoins'
import Header from '../components/Header'
import ImagesBar from '../components/ImagesBar'
import TopMovers from '../components/TopMovers'
import SearchBar from '../components/SearchBar'




function HomePage() {
  return (
    <main>
     
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      
      <div className="container mx-auto">
        <section aria-label="Top movers">
          <TopMovers />
        </section>

        <section className="px-10 mt-10 mb-5" aria-label="Coin search">
          <SearchBar />
        </section>

        <section className="px-10 mt-10 mb-5" aria-label="Promotional images">
          <ImagesBar />
        </section>

        <section className="px-5 mt-9" aria-label="All coins list">
          <AllCoins />
        </section>
      </div>
    </main>


  )
}

export default HomePage
