import React from 'react'
import btc from '../assets/Bitcoin.png';
import bnb from '../assets/bnb.png';
import eth from '../assets/ethereum.png';
import sol from '../assets/solana.png';
import usdt from '../assets/tether.png';
import xrp from '../assets/xrp.png';
import ada from '../assets/ada.png';
import doge from '../assets/doge.png';
import shiba from '../assets/shiba.png';
import sui from '../assets/sui.png';
import trx from '../assets/trx.png';
import link from '../assets/link.png';



function ImagesBar() {
  return (
    <div className='hidden md:block'>
    <div className=" w-full xl:h-52 md:h-32 flex justify-center items-center overflow-hidden p-1 relative ">
  <div className="flex transition-all duration-1000 ease-in-out ">

    <div className="mt-0 animate-pulse mx-5">
      <img src={btc} alt="btc" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>

    <div className="lg:mt-20 mt-10 animate-pulse mx-5">
      <img src={sui} alt="sui" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>
    


    <div className="mt-0 animate-pulse mx-5">
      <img src={trx} alt="trx" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>
    
    <div className="lg:mt-20 mt-10 animate-pulse mx-5">
      <img src={sol} alt="sol" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>

    <div className="mt-0 animate-pulse mx-5">
      <img src={usdt} alt="usdt" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>

    <div className="lg:mt-20 mt-10 animate-pulse mx-5">
      <img src={link} alt="link" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>

    <div className="mt-0 animate-pulse mx-5">
      <img src={ada} alt="ada" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>

    <div className="lg:mt-20 mt-10 animate-pulse mx-5">
      <img src={xrp} alt="xrp" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>

    <div className="mt-0 animate-pulse mx-5">
      <img src={shiba} alt="shiba" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>

    <div className="lg:mt-20 mt-10 animate-pulse mx-5">
      <img src={doge} alt="doge" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>
   

    <div className="mt-0 animate-pulse mx-5">
      <img src={eth} alt="eth" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>

    <div className="lg:mt-20 mt-10 animate-pulse mx-5">
      <img src={bnb} alt="bnb" className="lg:w-16 lg:h-auto w-28 h-auto" />
    </div>
    
  </div>
  
  
</div>
</div>
  )
}
export default ImagesBar

