import fs from 'fs'

import { postMetadata } from "./postMetadata";
import "./TimeLine.css";
import { getAllPostMetadata } from './getPostMetadata';
import Link from 'next/link';

interface event {
    date: string,
    title: string,
    content: string,
    link: string,
}

const parseTimeLineData = () => {
   
    // 读取events.json
    const file = "data/events.json"
    const content = fs.readFileSync(file, 'utf-8')
    const events:event[] = JSON.parse(content) 
    
    // 按照月份分组
    const eventsByMonth = events.reduce((acc, event) => {
        const month = event.date.split(" ")[0].substring(0,7)
        if (!acc[month]) {
            acc[month] = []
        }
        acc[month].push(event)
        return acc
    }, {} as {[key:string]:event[]})

    // 把博客的数据也加进去
    const postData = getAllPostMetadata()
    postData.forEach((post) => {
        const month = post.date.split(" ")[0].substring(0,7)
        if (!eventsByMonth[month]) {
            eventsByMonth[month] = []
        }
        eventsByMonth[month].push({
            date: post.date,
            title: `发布博客：${post.title}`,
            content: post.subtitle,
            link: `/posts/${post.folder}/${post.slug}`,
        })
    })

    // 按照日期排序
    let ret = Object.entries(eventsByMonth)

    const monthMap: {[key: string]: string} = {
        "01": "JANUARY",
        "02": "FEBRUARY",
        "03": "MARCH",
        "04": "APRIL",
        "05": "MAY",
        "06": "JUNE",
        "07": "JULY",
        "08": "AUGUST",
        "09": "SEPTEMBER",
        "10": "OCTOBER",
        "11": "NOVEMBER",
        "12": "DECEMBER",
    }

    return ret.map(([month, events]) => {
        // (monthMap[month.substring(5,7)] + " " + month.substring(0,4))

        return [monthMap[month.substring(5,7)] + " " + month.substring(0,4),
        events.sort((a, b) => {
            const aDate = new Date(a.date)
            const bDate = new Date(b.date)
            return - aDate.getTime() + bDate.getTime()
        })]
           
        }) as [string, event[]][]
}


const  TimeLine = (props:{ 
    posts:postMetadata[]}) => {
     
        const events = parseTimeLineData();
    
    return (
  

        <div className="flex flex-col items-center justify-center mb-20">
            {events?.map(([month, event]) => 

            (<section className="w-5/6">
                <div className="sticky top-0 bg-zinc-50 py-3 z-10 shadow-white">
                    <h2 className="group-date">
                        {month.toString()}
                    </h2>
                </div>
                <div className="timeline">
                {event.map((subevent:event) => (
                    <div className="relative">
                        {subevent.link == ""? (
                        <div className="dot"></div>):
                        (<Link href={subevent.link} className="dot"/>)}
                
                        <div className="pl-10">
                            <span className="timeline-date">{subevent.date}</span>
                            <h3 className="timeline-title">{subevent.title}</h3>
                            <p className="timeline-content">
                                {subevent.content}
                                </p>

                        </div>
                </div>))}
                </div>
            </section>)
            )}
        </div>
    )
}

export default TimeLine;