import React, { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./src/Toolbar";

const theme = {
  // Custom styles
  paragraph: "editor-paragraph",
};

function LexicalEditor() {
  const initialConfig = {
    namespace: "MyEditor", // Unique namespace
    theme, // Theme for styling
    onError: (error) => {
      console.error("Lexical Error:", error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin/>
      <div className="editor-container">
        {/* Rich Text Editor Plugins */}
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<div>Enter text here...</div>}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
}

export default LexicalEditor;
