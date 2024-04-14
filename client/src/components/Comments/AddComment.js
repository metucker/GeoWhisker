import React, { useState } from 'react';
import './Comments.css';

const AddComment = ({ catID }) => {
  const [commentData, setCommentData] = useState({
    ctitle: '',
    text: '',
    statusUpdate: 0,
    question: 0,
    urgent: 0,
    helpNeeded: 0,
  });

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCommentData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/cats/${catID}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      // Reset the comment state after successfully adding the comment
      setCommentData({
        ctitle: '',
        text: '',
        statusUpdate: 0,
        question: 0,
        urgent: 0,
        helpNeeded: 0,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      // Handle error
    }
  };

  return (
    <div className="addComment">
      <h2>Add Comment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="ctitle"
          value={commentData.ctitle}
          onChange={handleChange}
          placeholder="Enter comment title"
          required
        />
        <br />
        <textarea
          name="text"
          value={commentData.text}
          onChange={handleChange}
          placeholder="Enter your comment"
          required
        ></textarea>
        <br />
        <p>Please select a label for this comment:</p>
          <div className="status-bar-container">
          <label className={commentData.statusUpdate ? 'selected' : ''}>
              <input
                type="checkbox"
                name="statusUpdate"
                checked={commentData.statusUpdate}
                onChange={handleChange}
                style={{ display: 'none' }}

              />
              <div className="status-bar status update">Update</div>
            </label>
            <label className={commentData.question ? 'selected' : ''}>
              <input
                type="checkbox"
                name="question"
                checked={commentData.question}
                onChange={handleChange}
                style={{ display: 'none' }}

              />
              <div className="status-bar status question">Question</div>
            </label>
            <label className={commentData.urgent ? 'selected' : ''}>
              <input
                type="checkbox"
                name="urgent"
                checked={commentData.urgent}
                onChange={handleChange}
                style={{ display: 'none' }}

              />
              <div className="status-bar status urgent">Urgent</div>
            </label>
            <label className={commentData.helpNeeded ? 'selected' : ''}>

              <input
                type="checkbox"
                name="helpNeeded"
                checked={commentData.helpNeeded}
                onChange={handleChange}
                style={{ display: 'none'}}

              />
              <div className="status-bar status help-needed">Help Needed</div>
            </label>
          </div>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddComment;
