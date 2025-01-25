import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import ReactQuill from 'react-quill'; // Import Quill editor component

const QuillEditor = forwardRef((props, ref) => {
  const quillEditorRef = useRef();

  useImperativeHandle(ref, () => ({
    getEditor: () => quillEditorRef.current.getEditor(),
  }));

  return <ReactQuill ref={quillEditorRef} value={props.value} onChange={props.onChange} />;
});

export default QuillEditor;
