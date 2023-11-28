import PostPreview from "../../../../../../components/PostPreview";
import Series from "../../../../../../components/Series";
import { getAllPostMetadata, getPostMetadataByFolder } from "../../../../../../components/getPostMetadata";
import { getSeriesByFolder } from "../../../../../../components/getSeries";

export async function generateStaticParams() {
  const posts = getAllPostMetadata();
  
  const params = [] as{
        folder: string,
        series: string
  }[]
    posts.forEach((post) => {
        let series = getSeriesByFolder(post.folder)
        series.forEach((se) => {
            params.push({
                folder: post.folder,
                series: se.url
        })
    })
})
    
  return params
}


const SeriesPage = (props: any) => {
    
    const folder = props.params?.folder
    const series = props.params?.series

    const seriesIndex = getSeriesByFolder(folder).findIndex((se) => {
        return se.url == series
    })
    
    const Currentseries = getSeriesByFolder(folder)

    const posts = getPostMetadataByFolder(folder).filter((post) => {
        return post.series == seriesIndex
    })
    
    return (
        <div>
            <div className='mb-4'>
            {Currentseries?.map(se => (
                <Series se={se} isCurrent={se.index==seriesIndex}/>
            )) }
            </div>
        <div className='p-6 md:p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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


export default SeriesPage;