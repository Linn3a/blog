import Link from "next/link"
import { postMetadata } from "./postMetadata"

const PostPreview = (props: postMetadata) => {
  
    return (
        <div className="border border-slate-200 p-6 rounded-lg shadow-md bg-white">
          <p className="text-sm text-slate-400">{props.date}</p>

          <Link href={`${props.folder}/${props.slug}`}>
          <h2 className="font-bold text-sky-800 my-2 hover:underline">{props.title}</h2>
          </Link>
          <p className="text-slate-600 text-sm">{props.subtitle}</p>
          
        </div>
    )
}

export default PostPreview;