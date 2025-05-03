import React, { useState, useEffect } from 'react';
import { useExerciseContext } from '../../../../contexts/ExerciseContext';
import { useAction, updateExercise } from 'wasp/client/operations';
import { toast } from 'sonner';
import { Button } from '../../../../shadcn/components/ui/button';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import './prism-custom.css';

// Define custom highlighting for our special tags
const customMarkdownLanguage = {
  ...languages.markdown,
  tag: {
    pattern: /<(type|write|listen|mermaid)>[\s\S]*?<\/(type|write|listen|mermaid)>/g,
    inside: {
      'tag': [
        {
          pattern: /<\/?type>/g,
          alias: 'type-tag',
          inside: {
            'tag-name': {
              pattern: /type/,
              alias: 'keyword'
            },
            'punctuation': /[<>]/
          }
        },
        {
          pattern: /<\/?write>/g,
          alias: 'write-tag',
          inside: {
            'tag-name': {
              pattern: /write/,
              alias: 'keyword'
            },
            'punctuation': /[<>]/
          }
        },
        {
          pattern: /<\/?listen>/g,
          alias: 'listen-tag',
          inside: {
            'tag-name': {
              pattern: /listen/,
              alias: 'keyword'
            },
            'punctuation': /[<>]/
          }
        },
        {
          pattern: /<\/?mermaid>/g,
          alias: 'mermaid-tag',
          inside: {
            'tag-name': {
              pattern: /mermaid/,
              alias: 'keyword'
            },
            'punctuation': /[<>]/
          }
        }
      ],
      'content': {
        pattern: /[\s\S]+(?=<\/(?:type|write|listen|mermaid)>)/,
        inside: {
          ...languages.markdown,
          'mermaid-content': {
            pattern: /(?<=<mermaid>)[\s\S]+(?=<\/mermaid>)/,
            inside: {
              ...languages.javascript,
            },
            alias: 'language-mermaid'
          }
        },
        alias: 'language-markdown'
      }
    }
  }
};

const ExerciseEditor: React.FC<{ exerciseId: string }> = ({ exerciseId }) => {
  const { lesson_text, set_mode } = useExerciseContext() || {};
  const [editableText, setEditableText] = useState(lesson_text || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const updateExerciseAction = useAction(updateExercise);

  useEffect(() => {
    // Update the editable text when lesson_text changes
    if (lesson_text) {
      setEditableText(lesson_text);
    }
  }, [lesson_text]);

  const handleSave = async () => {
    if (!editableText.trim()) {
      toast.error('Lesson text cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await updateExerciseAction({
        id: exerciseId,
        updated_data: {
          lesson_text: editableText
        }
      });
      
      toast.success('Exercise content saved successfully');
      // Switch back to typing mode after saving
      set_mode?.('typing');
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast.error('Failed to save exercise content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert changes and go back to typing mode
    setEditableText(lesson_text || '');
    set_mode?.('typing');
  };

  // Helper to insert sensory mode tags
  const insertTag = (tag: 'type' | 'write' | 'listen' | 'mermaid') => {
    const textarea = document.querySelector('.npm__react-simple-code-editor__textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const selectionStart = textarea.selectionStart || 0;
    const selectionEnd = textarea.selectionEnd || 0;
    const selectedText = editableText.substring(selectionStart, selectionEnd);
    
    let taggedText = '';
    
    if (tag === 'mermaid') {
      taggedText = `<${tag}>\ngraph TD\n    A[Start] --> B[Process]\n    B --> C[End]\n</${tag}>`;
    } else {
      taggedText = `<${tag}>${selectedText || `Add ${tag} content here`}</${tag}>`;
    }
    
    const newText = 
      editableText.substring(0, selectionStart) + 
      taggedText +
      editableText.substring(selectionEnd);
    
    setEditableText(newText);
    
    // Focus back on textarea and set cursor position after insertion
    setTimeout(() => {
      const newTextarea = document.querySelector('.npm__react-simple-code-editor__textarea') as HTMLTextAreaElement;
      if (newTextarea) {
        newTextarea.focus();
        const newCursorPos = selectionStart + taggedText.length;
        newTextarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] p-6 flex flex-col overflow-hidden">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">Edit Exercise Content</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Insert:</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => insertTag('type')}
              className="bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
            >
              &lt;type&gt;
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => insertTag('write')}
              className="bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700"
            >
              &lt;write&gt;
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => insertTag('listen')}
              className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
            >
              &lt;listen&gt;
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => insertTag('mermaid')}
              className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700"
            >
              &lt;mermaid&gt;
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col border rounded-md shadow-md">
        <Editor
          value={editableText}
          onValueChange={setEditableText}
          highlight={code => highlight(code, customMarkdownLanguage, 'markdown')}
          padding={16}
          style={{
            fontFamily: '"Fira Code", "JetBrains Mono", monospace',
            fontSize: 14,
            lineHeight: 1.6,
            height: '100%',
            width: '100%',
            backgroundColor: '#282c34',
            borderRadius: '0.375rem',
            color: '#abb2bf',
          }}
          className="flex-1 min-h-0 w-full overflow-auto outline-none focus:ring-0 focus:border-primary-300 editor-container"
          textareaClassName="outline-none focus:ring-0 focus:border-primary-300 w-full h-full resize-none"
          onKeyDown={(e) => {
            // Ensure Enter key is processed normally
            if (e.key === 'Enter') {
              const textarea = e.target as HTMLTextAreaElement;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const value = textarea.value;
              
              // Insert a newline at cursor position
              const newValue = value.substring(0, start) + '\n' + value.substring(end);
              
              // Update the state with the new value
              setEditableText(newValue);
              
              // Set selection after the inserted newline
              setTimeout(() => {
                textarea.selectionStart = start + 1;
                textarea.selectionEnd = start + 1;
              }, 0);
              
              e.preventDefault();
            }
          }}
        />
      </div>
      
      <div className="flex justify-between mt-4 text-sm text-gray-500">
        <div>
          Lines: {editableText.split('\n').length} | 
          Words: {editableText.split(/\s+/).filter(Boolean).length} | 
          Characters: {editableText.length}
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <span className="inline-block w-3 h-3 rounded-full bg-[#4fd1c5]"></span>
          <span className="mr-2">&lt;type&gt;</span>
          <span className="inline-block w-3 h-3 rounded-full bg-[#f56565]"></span>
          <span className="mr-2">&lt;write&gt;</span>
          <span className="inline-block w-3 h-3 rounded-full bg-[#4299e1]"></span>
          <span className="mr-2">&lt;listen&gt;</span>
          <span className="inline-block w-3 h-3 rounded-full bg-[#ecc94b]"></span>
          <span>&lt;mermaid&gt;</span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseEditor; 