import { MeshGradientRenderer } from '@johnn-e/react-mesh-gradient'
import colors from 'nice-color-palettes'

const Home = () => {
  const backgroundColor = Math.floor(Math.random() * 100)
  return (
    <>
      <MeshGradientRenderer
        className='w-full h-full absolute top-0 left-0'
        colors={colors[backgroundColor]}
        speed={0.02}
      />
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <div className=' sm:w-10/12 md:w-1/2 flex flex-col align-center color-white bg-black bg-opacity-40 rounded-md gap-7 p-10'>
          <h1 className='text-5xl font-bold'>Welcome to the Mesh Gradient</h1>
          <p className='text-xl'>This is a simple example of how to use the Mesh Gradient component.</p>
          <p className='text-xl'>The background color is randomly selected from a list of nice color palettes.</p>
          <p className='text-xl'>The speed of the gradient animation is set to 0.01.</p>
        </div>
      </div>
    </>
  )
}

export default Home
