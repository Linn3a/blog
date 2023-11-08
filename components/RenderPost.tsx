import hljs from 'highlight.js';
import Markdown from 'markdown-to-jsx';
import {useEffect} from 'react'


const RenderPost = (props: any) => {
    useEffect(() => {
        // Highlight code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block as HTMLElement)
        })
    }, [])
    return (
        <div>
            <article className="prose lg:prose-xl">
            <Markdown>{props.content}</Markdown>
            </article>
        </div>
    )
}

export default RenderPost;