import { passage } from "../../../../types/blog";
import Tag from "../../../../components/Tag";
import Markdown from "markdown-to-jsx";

export default function ViewPassage(props: passage) {
    return (
        <div>
        <div className="w-fit 
        text-3xl text-center
        mx-auto mt-5 mb-2 px-4 py-3">
            {/* {props.title} */}
            标题
            </div>
            <div>
            {props.tags?.map((item,index) => (
                 <Tag key={index} name={item.name} color={item.color} id={item.id}/>
            ))}
            </div>
            <div className="w-5/6 mx-auto my-2">
                <div className="w-1/5 bg-sky-100 h-96 rounded-lg">
                hello
                </div>
                <div className="w-4/5">
                <Markdown>
                        # hello
                    {/* {props.content} */}
                    
                </Markdown>
                </div>
            </div>
            </div>
        )
}