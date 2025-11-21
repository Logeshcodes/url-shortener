export interface Link {
  code: string;
  url: string;
  clicks: number;
  createdAt: string;
  lastClickedAt: string | null;
}

export interface CreateLinkRequest {
  url: string;
  customCode?: string;
}

export interface CreateLinkResponse {
  code: string;
  url: string;
  shortUrl: string;
  createdAt: string;
}

export interface LinksResponse {
  links: Link[];
}

