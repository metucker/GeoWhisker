import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Comments.css';    


const Comments = ({ catID }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:4000/cats/${catID}/comments`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
        console.log('Comments:', data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        // Handle error
      }
    };

    fetchComments();
  }, [catID]);

  return (
    <div className="comments">
      <h2>Comments</h2>
      <ul>
      {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div className='comment' key={index} style={{ marginBottom: '30px', padding: '30px' }}>
              <div className="status-bar">
                {comment.urgent === 1 && <div className="status urgent">Urgent</div>}
                {comment.helpNeeded === 1 && <div className="status help-needed">Help Needed</div>}
                {comment.statusUpdate === 1 && <div className="status update">Update</div>}
                {comment.question === 1 && <div className="status question">Question</div>}
              </div>
              <h3>{comment.ctitle}</h3>
              <Link to={`/users/${comment.userID}`}>{comment.uname ? (comment.uname) : (`User${comment.userID}`)}</Link>
              <p>Created Date: {comment.dateCreated}</p>
              
              <hr /> {/* Horizontal line to visually separate the body from metadata */}
              <p>{comment.cbody}</p>
              {/* <p>Status Update: {comment.statusUpdate === 1 ? 'Yes' : 'No'}</p>
              <p>Question: {comment.question === 1 ? 'Yes' : 'No'}</p>
              <p>Urgent: {comment.urgent === 1 ? 'Yes' : 'No'}</p>
              <p>Help Needed: {comment.helpNeeded === 1 ? 'Yes' : 'No'}</p> */}
              
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </ul>
    </div>
  );
};

export default Comments;
