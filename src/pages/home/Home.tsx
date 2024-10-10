import { useState } from 'react'
import PageDefault from '../../components/product/PageDefault'
import FluentCard from '../../components/common/FluentCard'
import QuickStart from './QuickStart'

const Home = () => {
  const id = 1

  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <PageDefault filter='sepia-900'>
      <main className='w-full h-full flex flex-col  justify-center items-stretch'>
        <div
          className={`flex flex-row justify-center ease-in-out duration-1000 ${isFullscreen ? 'flex-1 transition-all' : 'flex-0 transition-all'}`}>
          <FluentCard
            addOnClasses={`duration-1000 transition-all ease-in-out ${isFullscreen ? 'flex-1 ' : ' flex-0'} `}>
            <QuickStart
              quickId={id}
              audioCallHanlder={() => {
                //TODO: Implement audio call
                setIsFullscreen((prev) => !prev)
              }}
              videoCallHandler={() => {
                //TODO: Implement video call
                setIsFullscreen((prev) => !prev)
              }}
            />
          </FluentCard>
        </div>
      </main>
    </PageDefault>
  )
}

export default Home
