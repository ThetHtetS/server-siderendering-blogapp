// Api call
// user data from ptotect
//and create action list
import { showAlert } from './alerts';
import axios from 'axios';
//query for a post and render data inject

exports.createAction = async (post_id , actionType) => {
    try {
      const res = await axios({
        method: 'POST',
        // url: '/api/v1/action',
        url: `/api/v1/action/${post_id}`,
        data: {
          actionType
        }

      });
  
      if (res.data.status === 'success') {
        // showAlert('success', 'registered successfully!');
      }
    } catch (err) {
      // showAlert('error', err.response.data.message);
    console.log('error', err);
    }

} 