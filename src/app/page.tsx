import {getAllPostMetadata} from '../../components/getPostMetadata'
import TimeLine from '../../components/TimeLine'

export default function Home() {
  const postData = getAllPostMetadata()

  
  return(
    <div className='flex flex-col-reverse items-center lg:flex-row justify-between items-start'>
    {/* <div className='w-full grid grid-cols-1 lg:grid-cols-2 lg: w-2/3 gap-5'>
    {postPreviews}
    </div> */}
    
    <div className='w-full
    '>
      <div className='w-5/6 m-auto '>
        <div className='text-4xl font-bold mt-6 mb-8'>
      👋 Welcome to Linnea's Blog
      </div>  
      <div className='text-lg text-gray-600 m-4'>
      This is Linnea.  I study computer science💻 at Fudan University. I'm documenting my learning notes in this blog.
        </div>
    </div>
    
      <TimeLine posts={postData} />
    </div>
    </div>
  )
  }