import { useContext, useEffect, useState } from 'react'
import PageDefault from '../../components/product/PageDefault'
import FluentCard from '../../components/common/FluentCard'
import ModalDialog from '../../components/common/ModalDialog'
import { CallSocketContext } from '../../contexts/callContext/callSocketContext'
import QuickStart from './QuickStart'
import CallContent from './CallContent'

const Home = () => {
  // const [isFullscreen, setIsFullscreen] = useState(false)

  const [isCallModalOpen, setIsCallModalOpen] = useState(false)

  const { selfId, localStreamRef, remoteStreamRef, makeCall, callerId, doAnswer, doHangUp, isInCall } =
    useContext(CallSocketContext) || {}

  const [idToCall, setIdToCall] = useState('')

  const handleHangUp = () => {
    // setIsFullscreen(false)
    doHangUp?.(true)
  }

  useEffect(() => {
    if (callerId) {
      setIsCallModalOpen(true)
    }
  }, [callerId])

  return (
    <PageDefault filter='sepia-900'>
      <main className='w-full h-full flex flex-col  justify-center items-stretch'>
        <div
          className={`flex flex-row justify-center ease-in-out duration-1000 ${isInCall ? 'flex-1 transition-all' : 'flex-0 transition-all'}`}>
          <FluentCard
            addOnClasses={`duration-1000 transition-all ease-in-out ${isInCall ? 'flex-1 ' : ' flex-0'} `}>
            {!isInCall ? (
              <QuickStart
                quickId={selfId ?? ''}
                audioCallHanlder={() => {
                  //TODO: Implement audio call
                  // setIsFullscreen((prev) => !prev)
                }}
                videoCallHandler={() => {
                  //TODO: Implement video call
                  makeCall?.(idToCall)
                  // setIsFullscreen((prev) => !prev)
                }}
                onChangePartnerId={(id) => setIdToCall(id)}
              />
            ) : (
              <CallContent hangUpHandler={handleHangUp} />
            )}
            {/* <CallContent hangUpHandler={handleHangUp} /> */}
          </FluentCard>
        </div>
      </main>

      <ModalDialog
        openModal={isCallModalOpen}
        closeModal={() => setIsCallModalOpen(false)}
        title='You get a call from +1 555 555 555. Do you want to accept?'
        acceptLabel='Accept'
        cancelLabel='Cancel'
        acceptHandler={() => {
          setIsCallModalOpen(false)
          // setIsFullscreen(true)
          doAnswer?.()
          console.log('Accept')
        }}
        cancelHandler={() => {
          setIsCallModalOpen(false)
          console.log('Cancel')
        }}
      />
    </PageDefault>
  )
}

export default Home
