import Link from "next/link"
import { postMetadata } from "./postMetadata"

const PostPreview = (props: postMetadata) => {
  
    return (
        <div className="border border-slate-200  rounded-lg bg-sky-50 shadow-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-md">
          <Link href={`/posts/${props.folder}/${props.slug}`}>
        
          <img  
            src={props.cover}
            alt={props.title}
            className="rounded-t-lg w-full"
          />
          </Link>

          <div className="p-6">
          <Link href={`/posts/${props.folder}/${props.slug}`}>
          <h2 className="font-bold text-xl text-sky-900 hover:underline">{props.title}</h2>
          </Link>
          <div className="mb-4 mt-6">
            🏷️ {props.tags.map(tag => (
              <div className="rounded-md mx-1 px-2 py-1 my-1 text-sky-900 bg-sky-100 text-sm inline-block">#{tag}</div>
            ))}
          </div>
          <p className="text-slate-700">{props.subtitle}</p>
          <p className="text-sm text-slate-400">{props.date}</p>

          </div>
          
        </div>
    )
}

export default PostPreview;