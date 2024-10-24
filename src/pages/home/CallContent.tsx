import PhoneXMarkIcon from '@heroicons/react/20/solid/PhoneXMarkIcon'
import { useContext, useEffect, useRef } from 'react'
import FluentButton from '../../components/common/FluentButton'
import { CallSocketContext } from '../../contexts/callContext/callSocketContext'

const CallContent = ({ hangUpHandler }: { hangUpHandler: () => void }) => {
  const { localStream, remoteStream } = useContext(CallSocketContext) || {}

  const internalLocalRef = useRef<HTMLVideoElement | null>(null)
  const internalRemoteRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const currentRef = internalLocalRef?.current
    if (!currentRef) return
    else {
      if (localStream) {
        currentRef.srcObject = localStream
      }
    }
    return () => {
      if (currentRef) {
        currentRef.srcObject = null
      }
    }
  }, [localStream])

  useEffect(() => {
    const currentRef = internalRemoteRef?.current
    if (!currentRef) return
    else {
      if (remoteStream) {
        currentRef.srcObject = remoteStream
      }
    }
    return () => {
      if (currentRef) {
        currentRef.srcObject = null
      }
    }
  }, [remoteStream])

  return (
    <>
      <figure className=' flex md:flex-row flex-col justify-between items-stretch gap-3 '>
        <div>
          <video
            playsInline
            controls
            controlsList='nodownload'
            ref={internalRemoteRef}
            autoPlay
            className='h-full w-full md:w-auto rounded-xl shadow-lg'
          />
        </div>
        <div>
          <video
            playsInline
            muted
            ref={internalLocalRef}
            autoPlay
            className='h-full w-full md:w-auto rounded-xl shadow-lg'
          />
        </div>
      </figure>
      <section className='flex flex-row justify-center items-left mb-4 '>
        <FluentButton onClick={hangUpHandler}>
          <PhoneXMarkIcon className='rounded w-12 h-12 text-red-500' />
        </FluentButton>
      </section>
    </>
  )
}

export default CallContent
