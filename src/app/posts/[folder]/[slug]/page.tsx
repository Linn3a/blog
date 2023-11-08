import Markdown from 'react-markdown';
import {getAllPostMetadata,getPost} from '../../../../../components/getPostMetadata';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm'
import remarkCallout from 'remark-callout';

import './rainbow.css';
import { postMetadata } from '../../../../../components/postMetadata';

// export const getStaticParams = async () => {
//     const posts = getAllPostMetadata();

//     return posts.map((post:postMetadata) => {
//         return {
//             folder: post.folder,
//             slug: post.slug.replaceAll(" ","_"),
//         }
//     })
// }

const Post = async (props:any) => {
    const subfolder = props.params.folder;
    const slug = props.params.slug;
    const post = getPost(subfolder, slug);
    
    return (
        <div>
        <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"/>
            </head>       
        <div className='flex flex-col justify-between h-full'> 
            <article className=" p-2 h-1/2 rounded-md  w-2/3 mx-auto mb-4  prose max-w-none prose-a:text-sky-800">
            <Markdown 
            remarkPlugins={[remarkGfm]}>{post.toc}</Markdown>
            </article>
            <article className="prose w-2/3 max-w-none lg:prose-base mx-auto">
           <Markdown
           components={{
            h1(props) {
                const {node,children,...rest} = props
                return <h1 id={children?.toString().toLowerCase().replaceAll(" ","-")} {...props} />
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
           remarkPlugins={[remarkMath,remarkGfm,remarkCallout]}
           rehypePlugins={[
            rehypeKatex,
            rehypeRaw,
            rehypeHighlight,
        ]}
    
          >{post.content}</Markdown>

            </article>
        </div>
        </div>
    )
}

export default Post;