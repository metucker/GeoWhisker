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
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment, index) => (
          <div className='comment' key={index} style={{ marginBottom: '30px', padding: '30px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <div className='displayName'>{comment[1]}{comment[0]}{comment[2]}
            {/* <Link key={comment[2]} to={`/users/${comment[1]}`}></Link> */}
            <a href src={`/users/${comment[1]}`}>{comment[2]}</a>


          </div>: {comment[0]}
        </div>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
