import PhoneXMarkIcon from '@heroicons/react/20/solid/PhoneXMarkIcon'
import { useContext, useEffect, useRef } from 'react'
import FluentButton from '../../components/common/FluentButton'
import { CallSocketContext } from '../../contexts/callContext/callSocketContext'

const CallContent = ({ hangUpHandler }: { hangUpHandler: () => void }) => {
  const {
    selfId,
    localStreamRef,
    remoteStreamRef,
    makeCall,
    callerId,
    doAnswer,
    doHangUp,
    isCalling,
    isInCall,
    localStream,
    remoteStream,
  } = useContext(CallSocketContext) || {}

  const internalLocalRef = useRef<HTMLVideoElement | null>(null)
  const internalRemoteRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!internalLocalRef.current) return
    else {
      if (localStream) {
        internalLocalRef.current.srcObject = localStream
      }
    }
  }, [localStream])

  useEffect(() => {
    if (!internalRemoteRef.current) return
    else {
      if (remoteStream) {
        internalRemoteRef.current.srcObject = remoteStream
      }
    }
  }, [remoteStream])

  return (
    <>
      <figure className=' flex md:flex-row flex-col justify-between items-stretch gap-3 '>
        <div>
          <video
            playsInline
            muted
            ref={internalRemoteRef ?? remoteStreamRef}
            autoPlay
            className='h-full w-full md:w-auto rounded-xl shadow-lg'
          />
        </div>
        <div>
          <video
            playsInline
            muted
            ref={internalLocalRef ?? localStreamRef}
            autoPlay
            className='h-full w-full md:w-auto rounded-xl shadow-lg'
          />
        </div>
      </figure>
      <section className='flex flex-row justify-center items-left mb-4 '>
        <FluentButton onClick={hangUpHandler}>
          <PhoneXMarkIcon className='rounded w-12 h-12' />
        </FluentButton>
      </section>
    </>
  )
}

export default CallContent
