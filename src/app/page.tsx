import Link from 'next/link'
import {getAllPostMetadata} from '../../components/getPostMetadata'
import PostPreview from '../../components/PostPreview'
import { postMetadata } from '../../components/postMetadata'

export default function Home() {
  const postMetadata = getAllPostMetadata()
  
  const postPreviews = postMetadata.map((post:postMetadata) => (
    <PostPreview key={post.slug} {...post} />
  )

  )
  return(
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
    {postPreviews}
    </div>
  )
  }