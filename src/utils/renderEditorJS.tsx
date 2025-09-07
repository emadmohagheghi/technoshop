import React from "react";
import Image from "next/image";

type ParagraphData = {
  text: string;
};

type HeaderData = {
  text: string;
  level: number;
};

type ListData = {
  style: "ordered" | "unordered";
  items: string[];
};

type ImageData = {
  file: {
    url: string;
  };
  caption?: string;
};

type QuoteData = {
  text: string;
  caption?: string;
};

type CodeData = {
  code: string;
};

type EditorBlock = {
  type: "paragraph" | "header" | "list" | "image" | "quote" | "code";
  data:
    | ParagraphData
    | HeaderData
    | ListData
    | ImageData
    | QuoteData
    | CodeData;
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
        const paragraphData = block.data as ParagraphData;
        return (
          <p
            className="text-[16px] leading-[168%]"
            key={index}
            dangerouslySetInnerHTML={{ __html: paragraphData.text }}
          />
        );

      case "header":
        const headerData = block.data as HeaderData;
        const Tag = `h${headerData.level}` as keyof React.JSX.IntrinsicElements;
        return (
          <Tag
            className="text-brand-primary w-full text-3xl font-medium"
            key={index}
          >
            {headerData.text}
          </Tag>
        );

      case "list":
        const listData = block.data as ListData;
        if (listData.style === "unordered") {
          return (
            <ul key={index} className="list-disc pl-5">
              {listData.items.map((item: string, i: number) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
        } else {
          return (
            <ol key={index} className="list-decimal pl-5">
              {listData.items.map((item: string, i: number) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ol>
          );
        }

      case "image":
        const imageData = block.data as ImageData;
        return (
          <div key={index} className="my-4">
            <Image
              src={imageData.file.url}
              alt={imageData.caption || ""}
              width={1920}
              height={1080}
              className="w-170"
            />
          </div>
        );

      case "quote":
        const quoteData = block.data as QuoteData;
        return (
          <blockquote
            key={index}
            className="my-4 border-l-4 pl-4 text-gray-600 italic"
          >
            {quoteData.text}
            {quoteData.caption && (
              <footer className="mt-2 text-sm text-gray-400">
                — {quoteData.caption}
              </footer>
            )}
          </blockquote>
        );

      case "code":
        const codeData = block.data as CodeData;
        return (
          <pre
            key={index}
            className="overflow-auto rounded bg-gray-100 p-3 text-sm"
          >
            <code>{codeData.code}</code>
          </pre>
        );

      default:
        return null; // بلاک ناشناخته
    }
  });
}
