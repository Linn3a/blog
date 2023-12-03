import Link from "next/link"

const AllSeries = (props: {
  folder:string,
  isRoot:boolean
}) => {
  if (props.isRoot) {
    return (
      <div className="p-1 rounded-lg bg-sky-900 text-zinc-50 inline-block mx-2">

        <Link href={`/posts/${props.folder}`}>
        <h2 className="font-bold text-md hover:underline">All</h2>
        </Link>
        
      </div>
    )
  } else {
    return (
      <div className="p-1 rounded-lg
      text-slate-400
        inline-block
        mx-2">

          <Link href={`/posts/${props.folder}`}>
          <h2 className="font-bold text-md hover:underline">All</h2>
          </Link>
          
        </div>
    )
  }
}

export default AllSeries;