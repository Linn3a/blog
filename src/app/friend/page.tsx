import { getFriends } from "../../../components/frend";

const Friend = () => {
    const friends = getFriends();   
    return (
    <div className="p-4 md:p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {friends.map((friend) => (
            <div className="border border-slate-200 bg-rose-50 p-6 flex flex-col rounded-xl">
            <img className="w-1/4 rounded-md" src={friend.avatar} alt={friend.name} />
            
            <h1 className="text-lg font-bold text-sky-900 my-2">{friend.name}</h1>
            
            <p className="my-1 text-sky-800">{friend.desc}</p>
            <a href = {friend.link} className="text-sky-800 hover:underline">
                link 🙌
                </a>

            </div>
        ))}
    </div>)
}

export default Friend;