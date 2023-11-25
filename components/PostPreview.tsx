import Link from "next/link"
import { postMetadata } from "./postMetadata"

const PostPreview = (props: postMetadata) => {
  
    return (
        <div className="border border-slate-200 p-6 rounded-lg bg-sky-50 shadow-sm">
          <p className="text-sm text-slate-400">{props.date}</p>

          <Link href={`/posts/${props.folder}/${props.slug}`}>
          <h2 className="font-bold text-xl text-sky-900 my-3 hover:underline">{props.title}</h2>
          </Link>
          <div className="mb-6 mt-8">
            🏷️ {props.tags.map(tag => (
              <div className="rounded-md mx-1 px-2 py-1 my-1 text-sky-900 bg-sky-100 text-sm hover:underline inline-block">#{tag}</div>
            ))}
          </div>
          <p className="text-slate-700">{props.subtitle}</p>

          
          
        </div>
    )
}

export default PostPreview;