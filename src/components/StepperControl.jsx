import React from 'react'

const StepperControl = () => {
  return (
    <div className='stepper-container flex justify-around mt-4 mb-8'>
      {/* back cutton */}
      <button className="bg-white text-slate-400 uppercase py-2 px-4 
      round-xl font-semibole cursor-pointer border-2 border-slate-300 
      hover:bg-slate-700 hovver:text-white transition duration-200 
      ease-in-out">
        Back
      </button>



      {/* Next Button */}
      <button className="bg-green-500 text-white uppercase py-2 px-4 
      round-xl font-semibole cursor-pointer 
      hover:bg-slate-700 hovver:text-white transition duration-200 
      ease-in-out">
        Next
      </button>
    </div>
  )
}

export default StepperControl