import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/nord.css';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../actions/Actions';

function Editor({ socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null);

    useEffect(() => {
        // Initialize CodeMirror instance
        const textarea = document.getElementById('realtimeEditor');
        editorRef.current = CodeMirror.fromTextArea(textarea, {
            mode: 'javascript',
            theme: 'nord',
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
        });

        // Handle local code changes and emit to other clients
        const handleCodeChange = (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();

            onCodeChange(code);

            // Emit the code change to other clients in the same room
            if (origin !== 'setValue' && socketRef.current) {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                });
            }
        };

        editorRef.current.on('change', handleCodeChange);

        return () => {
            editorRef.current.off('change', handleCodeChange);
            editorRef.current.toTextArea(); // Clean up the CodeMirror instance
        };
    }, [onCodeChange, roomId, socketRef]);

    useEffect(() => {
        // Listen for code changes from other clients
        if (socketRef.current) {
            const currentSocketRef = socketRef.current; // Copy socketRef.current to a variable
            const handleCodeChangeFromSocket = ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            };
            currentSocketRef.on(ACTIONS.CODE_CHANGE, handleCodeChangeFromSocket);

            return () => {
                currentSocketRef.off(ACTIONS.CODE_CHANGE, handleCodeChangeFromSocket);
            };
        }
    }, [socketRef]);

    return <textarea id="realtimeEditor"></textarea>;
}

export default Editor;
