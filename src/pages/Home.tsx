import { ClipboardDocumentIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { PhoneIcon, VideoCameraIcon } from '@heroicons/react/20/solid'
import PageDefault from '../components/product/PageDefault'

const Home = () => {
  const id = 1
  const [tooltipVisible, setTooltipVisible] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(id.toString())
    setTooltipVisible(true)
    setTimeout(() => {
      setTooltipVisible(false)
    }, 2000)
  }
  return (
    <PageDefault filter='sepia-900'>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <main className='flex flex-col align-center text-gray-100 bg-slate-500 bg-opacity-20 rounded-md gap-7 p-10 backdrop-blur-3xl'>
          <h1 className='text-5xl font-bold'>CatCallRTC</h1>
          <h2 className='text-xl font-medium '>
            Your ID is: {id ?? '___'}
            <button
              onClick={handleCopy}
              className='w-6 p-0 border-none text-cyan-700 hover:text-cyan-100 hover:border-none focus:outline-none focus-visible:outline-none'
              aria-label='Copy ID'
              data-tooltip-content='Copied!'
              data-tooltip-id='copy-tooltip'>
              <ClipboardDocumentIcon />
            </button>
            <ReactTooltip
              id='copy-tooltip'
              float={true}
              place='top'
              variant='light'
              noArrow={true}
              opacity={0.7}
              isOpen={tooltipVisible}
              className='text-xs'
              role='dialog'
            />
          </h2>

          <section className='flex flex-col items-left mb-4'>
            <label htmlFor='partner-id' className='text-xl font-medium mb-2'>
              Partner ID
            </label>
            <input
              id='partner-id'
              type='text'
              className='border border-gray-300 p-2 rounded w-full max-w-xs bg-transparent backdrop-blur-3xl placeholder-gray-300'
              placeholder='Enter partner ID'
            />
          </section>

          <section className='flex space-x-4 justify-around'>
            <button className='rounded-full p-2 border-slate-300 hover:border-slate-300 hover:opacity-70 active:opacity-25 focus:outline-none'>
              <PhoneIcon className='rounded w-12' />
            </button>
            <button className='rounded-full p-2 border-slate-300 hover:border-slate-300 hover:opacity-70 active:opacity-25 focus:outline-none'>
              <VideoCameraIcon className='rounded w-12 h-12' />
            </button>
          </section>
        </main>
      </div>
    </PageDefault>
  )
}

export default Home
