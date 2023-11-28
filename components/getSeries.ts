import fs from 'fs'

export interface series {
    index: number;
    name: string;
    folder: string;
    subtitle: string;
    url: string;
}

export const getSeriesByFolder = (folder:string) => {
    const file = "data/series.json"
    const content = fs.readFileSync(file, 'utf-8')
    const series: series[] = JSON.parse(content)
    return series.filter((s) => s.folder == folder);
}