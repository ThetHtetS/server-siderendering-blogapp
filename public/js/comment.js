/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';


export const createComment = async(data, postId)=>{

    try {
        const res = await axios.post(`/api/v1/posts/${postId}/comment`, data);
    
        if (res.data.status === 'success') {
          showAlert('success', 'created successfully!');
          window.setTimeout(() => {
            location.assign(`/posts/${res.data.data.data.post.slug}`);
          }, 1000);
        }
      } catch (err) {
        showAlert('error', err);
      }
}