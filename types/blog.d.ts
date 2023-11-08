import { comment } from './blog.d';
export type id = number | string;

export interface tag {
    id: id;
    name: string;
    color: string;
}

export interface category {
    id: id;
    name: string;
    cover: string;
}

export interface comment {
	id: id;
    content: string;
    user_id: id;
    passage_id: id;
    created_at: string;
}

export interface passage {
    id: id;
    title: string;
    desc: string;
    tags: Array<tag>;
    content?: string;
    created_at?: string;
    updated_at?: string;
    category_id: id;
    comments?: Array<comment>;
}
