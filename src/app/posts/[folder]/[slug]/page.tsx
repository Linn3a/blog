import Markdown from 'react-markdown';
import {getAllPostMetadata,getPost, getPostMetadataByFolder} from '../../../../../components/getPostMetadata';
import { parseDate } from '../../../../../components/parseDate';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm'
import remarkCallout from 'remark-callout';

import './rainbow.css';
import PrevNext from '../../../../../components/PrevNext';
import PostPreview from '../../../../../components/PostPreview';

export async function generateStaticParams() {
      const posts = getAllPostMetadata();
    
    return posts.map((post) => ({
      slug: post.slug.replaceAll(" ","_"),
      folder: post.folder,
    }))
  }


const Post = async (props:any) => {
    const subfolder = props.params.folder;
    const slug = props.params.slug;
    const post = getPost(subfolder, slug);
    const posts = getPostMetadataByFolder(subfolder).sort((a,b) => a.date < b.date ? 1 : -1);
    const index = posts.findIndex((post) => post.slug === slug);
    const prev = index < posts.length - 1? posts[index + 1] : null;
    const next = index > 0 ? posts[index - 1]: null;


    return (
        <div>
        <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"/>
        </head>       
        <div className='flex flex-col justify-between h-full'> 
        <div className='bg-sky-50 p-6 w-4/5 mx-auto md:h-52 rounded-xl border border-slate-150
                        flex flex-col justify-around items-center
                        my-4'>
        <div className='text-4xl font-bold text-center my-2'>
            {post.data.title}
        </div>
     
        <div className='text-sm text-slate-500 my-3'>
        {parseDate(post.data.date)}
        </div>
        <div className='text-slate-900'>
        {post.data.subtitle}

        </div>
        </div>
            <article className="p-2 h-1/2 rounded-md  w-11/12 lg:w-2/3 mx-auto mb-4  prose max-w-none prose-a:text-sky-800 prose-h2:text-sky-900 font-normal">
            <h2>目录</h2>
            <Markdown 
            remarkPlugins={[remarkGfm]}>{post.toc}</Markdown>
            </article>

            <article className="prose w-11/12 lg:w-2/3 max-w-none lg:prose-base mx-auto prose-pre:text-base prose-blockquote:not-italic prose-blockquote:text-slate-700 prose-quoteless call hl">
           <Markdown
           components={{
            h1(props) {
                const {node,children,...rest} = props
                return <h1 id={children?.toString().toLowerCase().replaceAll(" ","-")}  children={children?.toString()+" ✏️"} {...rest} />
            },
            h2(props) {
                const {node,children,...rest} = props
                return <h2 id={children?.toString().toLowerCase().replaceAll(" ","-")} {...props} />
            },
            h3(props) {
                const {node,children,...rest} = props
                return <h3 id={children?.toString().toLowerCase().replaceAll(" ","-")} {...props} />
            },
            h4(props) {
                const {node,children,...rest} = props
                return <h4 id={children?.toString().toLowerCase().replaceAll(" ","-")} {...props} />
            },
            h5(props) {
                const {node,children,...rest} = props
                return <h5 id={children?.toString().toLowerCase().replaceAll(" ","-")} {...props} />
            },
            h6(props) {
                const {node,children,...rest} = props
                return <h6 id={children?.toString().toLowerCase().replaceAll(" ","-")} {...props} />
            },
            }}
             /* 搜索== ==包起来的文本，变为高亮 */
           remarkPlugins={[remarkMath,remarkGfm,remarkCallout]}
           rehypePlugins={[
            rehypeKatex,
            rehypeRaw,
            rehypeHighlight,
        ]}
        key="content"
    
          >
          
            {post.content.replaceAll(/==(.+?)==/g,`<mark>$1</mark>`)}</Markdown>

            </article>
        </div>
        <div className='w-4/5 mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            {prev? <PrevNext post={prev} isPrev={true}/>: <div></div>}
            {next && <PrevNext post={next} isPrev={false}/>}

        </div>
        </div>
    )
}

export default Post;