import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaListOl,
  FaListUl,
  FaStrikethrough,
} from "react-icons/fa6";
import { Button, Divider, Select, Space } from "antd";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ListItems from "@tiptap/extension-list-item";
import { EditorContent, useEditor } from "@tiptap/react";

export const EditorMenu = ({ editor, handleSubmit }) => {
  if (!editor) return null;

  const textOptions = [
    {
      label: "Paragraph",
      value: "paragraph",
    },
    {
      label: "Heading 1",
      value: "heading 1",
    },
    {
      label: "Heading 2",
      value: "heading 2",
    },
    {
      label: "Heading 3",
      value: "heading 3",
    },
    {
      label: "Heading 4",
      value: "heading 4",
    },
    {
      label: "Heading 5",
      value: "heading 5",
    },
    {
      label: "Heading 6",
      value: "heading 6",
    },
  ];

  function onTextFormatChange(value) {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: parseInt(value.split(" ")[1]) })
        .run();
    }
  }

  return (
    <div
      style={{ gap: "2px", background: "white", borderRadius: "0.35em" }}
      className="d-flex align-items-center shadow-sm border radius-sm p-1"
    >
      <Select
        variant="filled"
        options={textOptions}
        defaultValue={"Normal"}
        style={{ width: "200px" }}
        onChange={onTextFormatChange}
      />
      <div style={{ height: "24px", borderRight: "1px solid #efefef" }}></div>
      <div className="d-flex align-items-center p-1">
        <Button
          type={"text"}
          icon={<FaBold />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          style={{ background: editor.isActive("bold") ? "#efefef" : "" }}
        />
        <Button
          type={"text"}
          icon={<FaItalic />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          style={{ background: editor.isActive("italic") ? "#efefef" : "" }}
        />
        <Button
          type={"text"}
          icon={<FaStrikethrough />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          style={{ background: editor.isActive("strike") ? "#efefef" : "" }}
        />
      </div>
      <div style={{ height: "24px", borderRight: "1px solid #efefef" }}></div>
      <div className="d-flex align-items-center p-1">
        <Button
          type={"text"}
          icon={<FaAlignJustify />}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          disabled={!editor.can().chain().focus().setTextAlign("justify").run()}
          style={{
            background: editor.isActive({ textAlign: "justify" })
              ? "#efefef"
              : "",
          }}
        />
        <Button
          type={"text"}
          icon={<FaAlignLeft />}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          disabled={!editor.can().chain().focus().setTextAlign("left").run()}
          style={{
            background: editor.isActive({ textAlign: "left" }) ? "#efefef" : "",
          }}
        />
        <Button
          type={"text"}
          icon={<FaAlignCenter />}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          disabled={!editor.can().chain().focus().setTextAlign("center").run()}
          style={{
            background: editor.isActive({ textAlign: "center" })
              ? "#efefef"
              : "",
          }}
        />
        <Button
          type={"text"}
          icon={<FaAlignRight />}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          disabled={!editor.can().chain().focus().setTextAlign("right").run()}
          style={{
            background: editor.isActive({ textAlign: "right" })
              ? "#efefef"
              : "",
          }}
        />
      </div>
      <div style={{ height: "24px", borderRight: "1px solid #efefef" }}></div>
      <div className="d-flex align-items-center p-1">
        <Button
          type={"text"}
          icon={<FaListUl />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          style={{
            background: editor.isActive("bulletList") ? "#efefef" : "",
          }}
        />
        <Button
          type={"text"}
          icon={<FaListOl />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          style={{
            background: editor.isActive("orderedList") ? "#efefef" : "",
          }}
        />
      </div>
      <Button type="primary" onClick={() => handleSubmit(editor.getHTML())}>
        Submit
      </Button>
    </div>
  );
};

const WYSIWYGEditor = ({
  content = "",
  handleSubmit,
  autoFocus = true,
  extensions = [
    StarterKit,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ],
}) => {
  const editor = useEditor({ content, extensions });
  if (!editor) return;

  return (
    <div
      direction="vertical"
      className="d-flex gap-2 p-2"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "1em",
        background: "#f9f9f9",
        flexDirection: "column",
      }}
    >
      <EditorMenu editor={editor} handleSubmit={handleSubmit} />
      <EditorContent
        editor={editor}
        autoFocus={autoFocus}
        style={{ flexGrow: 1 }}
      />
    </div>
  );
};

export default WYSIWYGEditor;
