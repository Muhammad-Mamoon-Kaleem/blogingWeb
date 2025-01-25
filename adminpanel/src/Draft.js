import React, { useState } from 'react';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleSubmit = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    console.log('Editor content:', rawContent);
    // You can send rawContent to your backend as needed
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
        placeholder="Write something..."
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default DraftEditor;
