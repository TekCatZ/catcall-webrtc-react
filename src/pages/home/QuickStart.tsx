import { ClipboardDocumentIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

interface QuickStartProps {
  quickId: number | string
  partnerId?: string
  onChangePartnerId?: (id: string) => void
  audioCallHanlder?: () => void
  videoCallHandler?: () => void
}

const QuickStart = (props: QuickStartProps) => {
  const { quickId, audioCallHanlder, videoCallHandler } = props

  const [tooltipVisible, setTooltipVisible] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(quickId.toString())
    setTooltipVisible(true)
    setTimeout(() => {
      setTooltipVisible(false)
    }, 2000)
  }

  return (
    <>
      <h1 className='text-5xl font-bold truncate'>CatCallRTC</h1>
      <div className='flex flex-row justify-start'>
        <h2 className='text-xl font-medium truncate'>Your ID is: {quickId ?? '___'}</h2>
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
      </div>

      <section className='flex flex-col items-left mb-4'>
        <label htmlFor='partner-id' className='text-xl font-medium mb-2'>
          Partner ID
        </label>
        <input
          id='partner-id'
          type='text'
          value={props.partnerId}
          onChange={(e) => props.onChangePartnerId?.(e.target.value)}
          className='border border-gray-300 p-2 rounded w-full max-w-xs bg-transparent backdrop-blur-3xl placeholder-gray-300'
          placeholder='Enter partner ID'
        />
      </section>

      {/* Button Row */}
      <section className='flex space-x-4 justify-around'>
        <button
          className='rounded-full p-2 border-slate-300 hover:border-slate-300 hover:opacity-70 active:opacity-25 focus:outline-none'
          onClick={audioCallHanlder}>
          <PhoneIcon className='rounded w-12' />
        </button>
        <button
          className='rounded-full p-2 border-slate-300 hover:border-slate-300 hover:opacity-70 active:opacity-25 focus:outline-none'
          onClick={videoCallHandler}>
          <VideoCameraIcon className='rounded w-12 h-12' />
        </button>
      </section>
    </>
  )
}
export default QuickStart
