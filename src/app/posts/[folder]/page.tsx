import PostPreview from '../../../../components/PostPreview';
import {getAllPostMetadata, getPostMetadataByFolder} from '../../../../components/getPostMetadata';

export async function generateStaticParams() {
    const posts = getAllPostMetadata();
  
  return posts.map((post) => ({
    folder: post.folder,
  }))
}

const Folder = (props: any) => {
    const folderName = props.params.folder;
    const posts = getPostMetadataByFolder(folderName)
    return (
        <div className='p-6 md:p-0 grid grid-cols-1 md:grid-cols-2 gap-6'>
            {
                posts.map((post) => {
                    return (
                        <PostPreview key={post.slug} {...post}/>
                    )
                })
            } 
        </div>
    )
    
}

export default Folder;