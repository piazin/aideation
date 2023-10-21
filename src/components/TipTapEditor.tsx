'use client';
import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import TipTapMenuBar from './TipTapMenuBar';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/lib/useDebounce';
import { useMutation } from '@tanstack/react-query';
import Text from '@tiptap/extension-text';
import axios from 'axios';
import { NoteType } from '@/lib/db/schema';
import { useCompletion } from 'ai/react';

type Props = {
  note: NoteType;
};

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = React.useState(note.editorState || `<h1>${note.name}</h1>`);
  const { complete, completion } = useCompletion({
    api: '/api/completion',
  });
  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/saveNote', {
        noteId: note.id,
        editorState,
      });

      return response.data;
    },
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        'Shift-l': () => {
          const prompt = this.editor.getText().split(' ').slice(-30).join(' ');
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const lastCompletion = React.useRef<string>('');

  React.useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 500);

  React.useEffect(() => {
    if (debouncedEditorState === '') return;

    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log('saved', data);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  }, [debouncedEditorState]);

  return (
    <>
      <div className="flex ">
        {editor && <TipTapMenuBar editor={editor} />}

        <Button disabled variant="outline">
          {saveNote.isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} spellCheck={false}></EditorContent>
      </div>
      <div className="h-4"></div>
      <span className="text-sm">
        Dica: Pressione{' '}
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border-gray-200 rounded-lg">
          Shift + L
        </kbd>
        para preenchimento automático de IA
      </span>
    </>
  );
};

export default TipTapEditor;
