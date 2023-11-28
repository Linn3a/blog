import PostPreview from '../../../../components/PostPreview';
import {getAllPostMetadata, getPostMetadataByFolder} from '../../../../components/getPostMetadata';
import { getSeriesByFolder } from '../../../../components/getSeries';
import Series from '../../../../components/Series';

export async function generateStaticParams() {
    const posts = getAllPostMetadata();
  
  return posts.map((post) => ({
    folder: post.folder,
  }))
}

const Folder = (props: any) => {
    const folderName = props.params.folder;
    const posts = getPostMetadataByFolder(folderName)
    const series = getSeriesByFolder(folderName)
    return (
        <div>
            <div className='mb-4'>
            {series.map(se => (
                <Series se={se} isCurrent={false}/>
            )) }
            </div>
        <div className='p-6 md:p-0 grid grid-cols-2 lg:grid-cols-3 gap-6'>
            {
                posts.map((post) => {
                    return (
                        <PostPreview key={post.slug} {...post}/>
                    )
                })
            } 
        </div>
        </div>
    )
    
}

export default Folder;