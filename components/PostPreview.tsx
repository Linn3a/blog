import Link from "next/link"
import { postMetadata } from "./postMetadata"

const PostPreview = (props: postMetadata) => {
  
    return (
        <div className="border border-slate-200 p-6 rounded-lg bg-sky-50 shadow-sm">
          <p className="text-sm text-slate-400">{props.date}</p>

          <Link href={`/posts/${props.folder}/${props.slug}`}>
          <h2 className="font-bold text-xl text-sky-900 my-3 hover:underline">{props.title}</h2>
          </Link>
          <p className="text-slate-700">{props.subtitle}</p>
          
        </div>
    )
}

export default PostPreview;