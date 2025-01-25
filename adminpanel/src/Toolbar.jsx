import React from 'react';
import {
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
    INDENT_CONTENT_COMMAND,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const ToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();

    // Apply text formatting (e.g., bold, italic, underline)
    const applyFormat = (format) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    // Apply headings (H1, H2, H3)
    const applyHeading = (heading) => {
        editor.update(() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, heading);
        });
    };

    // Apply text alignment
    const applyAlignment = (alignment) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    };

    return (
        <div className="flex flex-wrap space-x-2 p-2 bg-gray-200 border-b">
            {/* Bold */}
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyFormat("bold");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Bold"
            >
                Bold
            </button>

            {/* Italic */}
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyFormat("italic");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Italic"
            >
                Italic
            </button>

            {/* Underline */}
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyFormat("underline");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Underline"
            >
                Underline
            </button>

            {/* Headings */}
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyHeading("h1");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Heading 1"
            >
                H1
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyHeading("h2");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Heading 2"
            >
                H2
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyHeading("h3");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Heading 3"
            >
                H3
            </button>

            {/* Alignments */}
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyAlignment("left");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Align Left"
            >
                Left
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyAlignment("center");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Align Center"
            >
                Center
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyAlignment("right");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Align Right"
            >
                Right
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    applyAlignment("justify");
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Justify"
            >
                Justify
            </button>

            {/* Indent and Outdent */}
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Indent"
            >
                Indent
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
                }}
                className="p-1 text-sm bg-white border rounded hover:bg-gray-100"
                title="Outdent"
            >
                Outdent
            </button>
        </div>
    );
};

export default ToolbarPlugin;
