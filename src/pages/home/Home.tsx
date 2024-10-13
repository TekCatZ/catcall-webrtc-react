import { useState } from 'react'
import PageDefault from '../../components/product/PageDefault'
import FluentCard from '../../components/common/FluentCard'
import ModalDialog from '../../components/common/ModalDialog'
import QuickStart from './QuickStart'
import CallContent from './CallContent'

const Home = () => {
  const id = 1

  const [isFullscreen, setIsFullscreen] = useState(false)

  const [isCallModalOpen, setIsCallModalOpen] = useState(false)

  const handleHangUp = () => {
    //TODO: Implement hang up
    setIsFullscreen((prev) => !prev)
  }

  return (
    <PageDefault filter='sepia-900'>
      <main className='w-full h-full flex flex-col  justify-center items-stretch'>
        <div
          className={`flex flex-row justify-center ease-in-out duration-1000 ${isFullscreen ? 'flex-1 transition-all' : 'flex-0 transition-all'}`}>
          <FluentCard
            addOnClasses={`duration-1000 transition-all ease-in-out ${isFullscreen ? 'flex-1 ' : ' flex-0'} `}>
            {!isFullscreen ? (
              <QuickStart
                quickId={id}
                audioCallHanlder={() => {
                  //TODO: Implement audio call
                  setIsFullscreen((prev) => !prev)
                }}
                videoCallHandler={() => {
                  //TODO: Implement video call
                  // setIsFullscreen((prev) => !prev)
                  setIsCallModalOpen(true)
                }}
              />
            ) : (
              <CallContent hangUpHandler={handleHangUp} />
            )}
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
          setIsFullscreen(true)
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
