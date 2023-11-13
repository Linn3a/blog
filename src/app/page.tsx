import Link from 'next/link'
import {getAllPostMetadata} from '../../components/getPostMetadata'
import PostPreview from '../../components/PostPreview'
import { postMetadata } from '../../components/postMetadata'
import TimeLine from '../../components/TimeLine'

export default function Home() {
  const postData = getAllPostMetadata()
  
  
  const postPreviews = postData.map((post:postMetadata) => (
    <PostPreview key={post.slug} {...post} />
  )

  )
  return(
    <div className='flex flex-col-reverse items-center lg:flex-row justify-between items-start'>
    {/* <div className='w-full grid grid-cols-1 lg:grid-cols-2 lg: w-2/3 gap-5'>
    {postPreviews}
    </div> */}
    <div className='w-full
    '>
      <TimeLine posts={postData} />
    </div>
    </div>
  )
  }