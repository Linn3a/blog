import Link from "next/link"
import { postMetadata } from "./postMetadata"

const PrevPost = ( props :{
    post:postMetadata,
    isPrev:boolean
} ) => {
    const {post, isPrev} = props
    return (
        <div className="block p-3 border border-red-100 bg-rose-50 rounded-md">
            <Link href={`/posts/${post.folder}/${post.slug}`}>
            {isPrev ? <div className="mb-2 text-slate-700">👈 上一篇</div>:
            <div className="mb-2 text-slate-700">👉 下一篇</div>}
            {/* <h3 className="text-xl font-bold my-2">{post.title}</h3>
            <p>{post.subtitle}</p> */}
        
         

         
          <h2 className="font-bold text-xl hover:underline">{post.title}</h2>
          <div className="mb-4 mt-6">
            🏷️ {post.tags.map(tag => (
              <div className="rounded-md mx-1 px-2 py-1 my-1 text-sky-900 bg-rose-100 text-sm inline-block">#{tag}</div>
            ))}
          </div>
          <p className="text-slate-700">{post.subtitle}</p>
          <p className="text-sm text-slate-400">{post.date}</p>
          </Link>

          
        </div>
    )
}

export default PrevPost;