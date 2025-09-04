import React from "react";
import Image from "next/image";

type EditorBlock = {
  type: string;
  data: any;
};

type EditorData = {
  time: number;
  blocks: EditorBlock[];
  version: string;
};

export function renderEditorJS(data: EditorData) {
  return data.blocks.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p
            className="leading-[168%] text-[16px]"
            key={index}
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );

      case "header":
        const Tag = `h${block.data.level}` as keyof React.JSX.IntrinsicElements;
        return (
          <Tag className="text-brand-primary text-3xl font-medium w-full" key={index}>
            {block.data.text}
          </Tag>
        );

      case "list":
        if (block.data.style === "unordered") {
          return (
            <ul key={index} className="list-disc pl-5">
              {block.data.items.map((item: string, i: number) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
        } else {
          return (
            <ol key={index} className="list-decimal pl-5">
              {block.data.items.map((item: string, i: number) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ol>
          );
        }

      case "image":
        return (
          <div key={index} className="my-4">
            <Image
              src={block.data.file.url}
              alt={block.data.caption || ""}
              width={1920}
              height={1080}
              className="w-170"
            />
          </div>
        );

      case "quote":
        return (
          <blockquote
            key={index}
            className="my-4 border-l-4 pl-4 text-gray-600 italic"
          >
            {block.data.text}
            {block.data.caption && (
              <footer className="mt-2 text-sm text-gray-400">
                — {block.data.caption}
              </footer>
            )}
          </blockquote>
        );

      case "code":
        return (
          <pre
            key={index}
            className="overflow-auto rounded bg-gray-100 p-3 text-sm"
          >
            <code>{block.data.code}</code>
          </pre>
        );

      default:
        return null; // بلاک ناشناخته
    }
  });
}
