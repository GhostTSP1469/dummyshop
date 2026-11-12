export interface CommentUser{
  id:number,
  username:string,
  fullName:string
}

export interface CommentData{
  id:number,
  body:string,
  postId:number,
  likes:number,
  user:CommentUser
}

export interface CommentResponse{
  comments:CommentData[],
  total:number,
  skip:number,
  limit:number
}

export type NewCommentResponse=Omit<CommentData,'likes'>
