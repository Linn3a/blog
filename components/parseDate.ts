const dateFormat = (fmt:string, date:Date):string => {
    const opt:any = {
        "Y+": date.getUTCFullYear().toString(),        // 年
        "m+": (date.getUTCMonth() + 1).toString(),     // 月
        "d+": date.getUTCDate().toString(),            // 日
        "H+": date.getUTCHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
    }
    let ret:string[] | null;
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

export const parseDate = (date:Date) => {
return dateFormat("YYYY-mm-dd HH:MM", date)
};