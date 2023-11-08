import { postMetadata } from "./postMetadata"
import fs from "fs"
import matter from "gray-matter"

const genToc = (content:string) => {
  // 逐行阅读
  const lines = content.split("\n");
  let toc: string = "";
  // 栈
  const stack: string[] = [];
  for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // 标题
      const title = line.match(/^#+\s+(.*)/);
      if (title) {
          const level = title[0].match(/#/g)?.length;
          
          const codeBlock = lines.slice(i).join("\n").match(/```/g);
          if (codeBlock && codeBlock.length % 2 === 1) {
              continue;
          }
          if (level) {
              const titleText = title[1];
              const slug = titleText.toLowerCase().replace(/\s/g, "-");
              const tocItem = `${"  ".repeat(level - 1)}- [${titleText}](#${slug})`;
              toc += tocItem + "\n";
              stack.push(slug);
          }
      }
  } 

  return toc;
}

export const getPost = (subfolder:string, slug:string) => {
  const folder = "posts/"
  slug = slug.replaceAll("_", " ")

  const files = `${folder}${subfolder}/${slug}.md`
  const content = fs.readFileSync(files, 'utf-8')
  
  const matterResult = matter(content)
  return {...matterResult,
    toc : genToc(matterResult.content),}
}


export const getAllPostMetadata = ():postMetadata[] => {
    const folder = "posts/"
    // 找下面的文件夹
    const folders = fs.readdirSync(folder)
    const posts:postMetadata[] = []
    folders.forEach((subfolder) => {
      const files = fs.readdirSync(`${folder}${subfolder}/`)
      const markdownFiles = files.filter((file) => file.endsWith(".md"))
    markdownFiles.forEach((fileName) => {
    const fileContents = fs.readFileSync(`${folder}${subfolder}/${fileName}`, "utf-8")
    const matterResult = matter(fileContents)
    const toc = genToc(matterResult.content);
  
      posts.push(
        {
        title: matterResult.data.title,
        subtitle: matterResult.data.subtitle,
        date: `${matterResult.data.date.getFullYear()}-${matterResult.data.date.getMonth()}-${matterResult.data.date.getDate()}`,
        tags: matterResult.data.tags,
        toc: toc,
        slug: fileName.replace(".md", "").replaceAll(" ", "_"),
        folder: subfolder,
      })
    })  
})
    return posts;
}


export const getPostMetadataByFolder = (folder:string):postMetadata[] => {
  const _folder = `posts/${folder}/`
  const files = fs.readdirSync(_folder)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))
  const posts = markdownFiles.map((fileName) => {
    const fileContents = fs.readFileSync(`${_folder}${fileName}`, "utf-8")
    const matterResult = matter(fileContents)
    const toc = genToc(matterResult.content);
  
      return {
        title: matterResult.data.title,
        subtitle: matterResult.data.subtitle,
        date: `${matterResult.data.date.getFullYear()}-${matterResult.data.date.getMonth()}-${matterResult.data.date.getDate()}`,
        tags: matterResult.data.tags,
        toc: toc,
        slug: fileName.replace(".md", "").replaceAll(" ", "_"),
        folder: folder,
      }
    })
    return posts;
}