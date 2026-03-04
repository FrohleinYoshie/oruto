import type { AppDTO } from "./app";
import type { AlternativeCommentDTO } from "./comment";

export interface AlternativeDTO {
    id: string;
    targetAppId: string;
    altApp: AppDTO;
    upvotes: number;
    comments: AlternativeCommentDTO[];
    createdAt: Date;
}
