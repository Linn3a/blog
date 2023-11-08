import { tag } from "../types/blog"

// outline: none;
//         background-color: ${props.color};
//         border-radius: 5px;
//         padding:5px 8px;
//         margin: 10px 10px;
//         font-size: 14px;
//         font-weight: 600;
//         text-align: center;

const Tag = (props:tag) => {
    return (
        <div className={`bg-${props.color} rounded-md py-1 px-2 m-2 text-center text-xs`}>
            <h1>{props.name}</h1>
        </div>
    )
}

export default Tag