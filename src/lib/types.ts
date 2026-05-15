export interface PostFrontmatter {
  title: string;
  createAt: string;
  updateAt: string | null;
  tags: string[];
}

export interface PostMeta {
  slug: string;
  frontmatter: PostFrontmatter;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

export interface PostMetaWithContent extends PostMeta {
  rawContent: string;
}
