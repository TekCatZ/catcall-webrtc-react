import PhoneXMarkIcon from '@heroicons/react/20/solid/PhoneXMarkIcon'
import FluentButton from '../../components/common/FluentButton'

const CallContent = ({ hangUpHandler }: { hangUpHandler: () => void }) => {
  return (
    <>
      <figure className=' flex md:flex-row flex-col justify-between items-stretch gap-3 '>
        <div>
          <img
            src='https://picsum.photos/1000/500'
            alt='partner'
            className='h-full w-full md:w-auto rounded-xl shadow-lg'
          />
        </div>
        <div>
          <img
            src='https://picsum.photos/600/300'
            alt='caller'
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
