import React, { useState } from 'react';

const AddComment = ({ catID }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/cats/${catID}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      // Reset the comment state after successfully adding the comment
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Add Comment</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment"
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddComment;
