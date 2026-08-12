"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Pilcrow,
  Undo,
  Redo,
  X,
} from 'lucide-react';
import { useState, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rte-image',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your blog content here...',
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const insertImage = useCallback(() => {
    if (!editor) return;
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    setImageUrl('');
    setShowImageInput(false);
  }, [editor, imageUrl]);

  const toolbarBtnClass = (isActive: boolean) => ({
    padding: '0.4rem 0.6rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive ? 'var(--eucalyptus-green, #7D9182)' : '#F3F4F6',
    color: isActive ? 'white' : '#374151',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s',
    fontSize: '0.8rem',
    fontWeight: 500,
  });

  const toolbarGroupStyle = {
    display: 'flex',
    gap: '0.25rem',
    paddingRight: '0.75rem',
    marginRight: '0.75rem',
    borderRight: '1px solid #E5E7EB',
  } as const;

  if (!editor) {
    return (
      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '1rem',
        minHeight: '300px',
        backgroundColor: '#F9FAFB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9CA3AF',
      }}>
        Loading editor...
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.25rem',
        padding: '0.6rem 0.75rem',
        backgroundColor: '#FAFAFA',
        borderBottom: '1px solid #E5E7EB',
        alignItems: 'center',
      }}>
        {/* Block types */}
        <div style={toolbarGroupStyle}>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            style={toolbarBtnClass(editor.isActive('paragraph'))}
            title="Paragraph"
          >
            <Pilcrow size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            style={toolbarBtnClass(editor.isActive('heading', { level: 2 }))}
            title="Heading 2"
          >
            <Heading2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            style={toolbarBtnClass(editor.isActive('heading', { level: 3 }))}
            title="Heading 3"
          >
            <Heading3 size={15} />
          </button>
        </div>

        {/* Inline formatting */}
        <div style={toolbarGroupStyle}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={toolbarBtnClass(editor.isActive('bold'))}
            title="Bold (Ctrl+B)"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={toolbarBtnClass(editor.isActive('italic'))}
            title="Italic (Ctrl+I)"
          >
            <Italic size={15} />
          </button>
        </div>

        {/* Lists */}
        <div style={toolbarGroupStyle}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={toolbarBtnClass(editor.isActive('bulletList'))}
            title="Bullet List"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            style={toolbarBtnClass(editor.isActive('orderedList'))}
            title="Numbered List"
          >
            <ListOrdered size={15} />
          </button>
        </div>

        {/* Blockquote */}
        <div style={toolbarGroupStyle}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            style={toolbarBtnClass(editor.isActive('blockquote'))}
            title="Blockquote"
          >
            <Quote size={15} />
          </button>
        </div>

        {/* Link */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          paddingRight: '0.75rem',
          marginRight: '0.75rem',
          borderRight: '1px solid #E5E7EB',
          alignItems: 'center',
        }}>
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(!showLinkInput);
              setShowImageInput(false);
              if (editor.isActive('link')) {
                const attrs = editor.getAttributes('link');
                setLinkUrl(attrs.href || '');
              } else {
                setLinkUrl('');
              }
            }}
            style={toolbarBtnClass(editor.isActive('link'))}
            title="Add Link"
          >
            <LinkIcon size={15} />
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={removeLink}
              style={toolbarBtnClass(false)}
              title="Remove Link"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Image */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          paddingRight: '0.75rem',
          marginRight: '0.75rem',
          borderRight: showImageInput || showLinkInput ? '1px solid #E5E7EB' : 'none',
          alignItems: 'center',
        }}>
          <button
            type="button"
            onClick={() => {
              setShowImageInput(!showImageInput);
              setShowLinkInput(false);
              setImageUrl('');
            }}
            style={toolbarBtnClass(false)}
            title="Insert Image"
          >
            <ImageIcon size={15} />
          </button>
        </div>

        {/* Undo / Redo */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          marginLeft: 'auto',
        }}>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            style={{
              ...toolbarBtnClass(false),
              opacity: editor.can().undo() ? 1 : 0.4,
              cursor: editor.can().undo() ? 'pointer' : 'not-allowed',
            }}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            style={{
              ...toolbarBtnClass(false),
              opacity: editor.can().redo() ? 1 : 0.4,
              cursor: editor.can().redo() ? 'pointer' : 'not-allowed',
            }}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={15} />
          </button>
        </div>
      </div>

      {/* Link input bar */}
      {showLinkInput && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.6rem 0.75rem',
          backgroundColor: '#FFFBEB',
          borderBottom: '1px solid #FDE68A',
          alignItems: 'center',
        }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#92400E' }}>Link URL:</label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            style={{
              flex: 1,
              padding: '0.35rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid #FDE68A',
              fontSize: '0.85rem',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyLink();
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false);
                setLinkUrl('');
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={applyLink}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--eucalyptus-green, #7D9182)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => { setShowLinkInput(false); setLinkUrl(''); }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Image input bar */}
      {showImageInput && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.6rem 0.75rem',
          backgroundColor: '#ECFDF5',
          borderBottom: '1px solid #6EE7B7',
          alignItems: 'center',
        }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#065F46' }}>Image URL:</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              flex: 1,
              padding: '0.35rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid #6EE7B7',
              fontSize: '0.85rem',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                insertImage();
              }
              if (e.key === 'Escape') {
                setShowImageInput(false);
                setImageUrl('');
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={insertImage}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--eucalyptus-green, #7D9182)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => { setShowImageInput(false); setImageUrl(''); }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              backgroundColor: 'white',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="rte-editor-content"
        style={{
          padding: '1rem 1.25rem',
          minHeight: '300px',
          backgroundColor: 'white',
        }}
      />
    </div>
  );
}
