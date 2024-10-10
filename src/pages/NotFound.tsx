import PageDefault from '../components/product/PageDefault'

const NotFound = () => {
  return (
    <PageDefault filter='grayscale'>
      <main className='grid min-h-full place-items-centerpx-6 py-24 sm:py-32 lg:px-8'>
        <div className='text-center'>
          <p className='text-base font-semibold text-rose-300'>404</p>
          <h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-200 sm:text-5xl'>
            Page not found
          </h1>
          <p className='mt-6 text-base leading-7 text-gray-300'>
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <a href='/' className='text-sm font-semibold  text-white'>
              <span aria-hidden='true'>&larr;</span> Go back home
            </a>
          </div>
        </div>
      </main>
    </PageDefault>
  )
}

export default NotFound
