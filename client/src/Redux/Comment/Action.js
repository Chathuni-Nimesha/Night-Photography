import { BASE_URL } from "../../Config/api";
import { handleUnauthorized } from "../../Config/auth";
import { CREATE_COMMENT, DELETE_COMMENT, EDIT_COMMENT, GET_ALL_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT } from "./ActionType";

export const createComment = (data) => async (dispatch) => {
  try {
  const res = await fetch(`${BASE_URL}/api/comments/create/${data.postId}`, {
    method: "POST",

     headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },

    body: JSON.stringify(data.data),
  });

  if (handleUnauthorized(res)) return;
  if (!res.ok) return;
  const resData=await res.json();
  dispatch({type:CREATE_COMMENT,payload:resData});
  } catch (error) {
    return;
  }
};


export const likeComment=(data)=>async(dispatch)=>{
    const res= await fetch(`${BASE_URL}/api/comments/like/${data.commentId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            Authorization:'Bearer '+data.jwt,
        },
        body:JSON.stringify(data.data)
    })
    if (handleUnauthorized(res) || !res.ok) return;
    const resData=await res.json();
    dispatch({type:LIKE_COMMENT,payload:resData});
}

export const unLikeComment=(data)=>async(dispatch)=>{
  const res = await fetch(`${BASE_URL}/api/comments/unlike/${data.commentId}`,{
      method:"PUT",
      headers:{
          "Content-Type":"application/json",
          Authorization:'Bearer '+data.jwt,
      },
      body:JSON.stringify(data.data)
  })
  if (handleUnauthorized(res) || !res.ok) return;
  const resData=await res.json();
  dispatch({type:UNLIKE_COMMENT,payload:resData});
}

export const editComment=(data)=>async(dispatch)=>{
  const res = await fetch(`${BASE_URL}/api/comments/edit`,{
      method:"PUT",
      headers:{
          "Content-Type":"application/json",
          Authorization:'Bearer '+data.jwt,
      },
      body:JSON.stringify(data.data)
  })
  if (handleUnauthorized(res)) return { ok: false };
  if (!res.ok) return { ok: false };
  dispatch({type:EDIT_COMMENT,payload:{ id: data.data?.id, content: data.data?.content }});
  return { ok: true };
}

export const deleteComment=(data)=>async(dispatch)=>{
  const res = await fetch(`${BASE_URL}/api/comments/delete/${data.commentId}`,{
    method:"DELETE",
    headers:{
        "Content-Type":"application/json",
        Authorization:'Bearer '+data.jwt,
    },
  })
  if (handleUnauthorized(res)) return { ok: false };
  if (!res.ok) return { ok: false };
  dispatch({type:DELETE_COMMENT,payload:{ id: data.commentId }});
  return { ok: true };
}

export const getAllComments=(data)=>async(dispatch)=>{
  try {
    const res=await fetch(`${BASE_URL}/api/comments/post/${data.postId}`,{
      method:"GET",
      headers:{
          "Content-Type":"application/json",
          Authorization:'Bearer '+data.jwt,
      },
    
  })
  if (handleUnauthorized(res)) return;
  const resData=await res.json();
  dispatch({type:GET_ALL_COMMENT,payload:resData});
    
  } catch (error) {
    
  }
}