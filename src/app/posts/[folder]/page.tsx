import PostPreview from '../../../../components/PostPreview';
import {getPostMetadataByFolder} from '../../../../components/getPostMetadata';

// export const getStaticParams = async () => {
    // const posts = getPostMetadata();

    // return posts.map((post) => {
    //     return {
    //         tag: post.tags[0],
    //         slug: post.slug.replaceAll(" ","_"),
    //     }
    // })
// }

const Folder = (props: any) => {
    const folderName = props.params.folder;
    console.log(folderName);
    const posts = getPostMetadataByFolder(folderName)
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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