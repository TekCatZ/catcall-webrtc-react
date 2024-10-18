import PhoneXMarkIcon from '@heroicons/react/20/solid/PhoneXMarkIcon'
import { useContext, useEffect } from 'react'
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

  useEffect(() => {
    if (isInCall || isCalling) {
      if (localStream) {
        if (localStreamRef && localStreamRef.current) localStreamRef.current.srcObject = localStream
      }
      if (remoteStream && remoteStreamRef && remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = remoteStream
      }
    }
  }, [isInCall, isCalling, localStream, remoteStream])
  return (
    <>
      <figure className=' flex md:flex-row flex-col justify-between items-stretch gap-3 '>
        <div>
          <video
            playsInline
            muted
            ref={remoteStreamRef}
            autoPlay
            className='h-full w-full md:w-auto rounded-xl shadow-lg'
          />
        </div>
        <div>
          <video
            playsInline
            muted
            ref={localStreamRef}
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
