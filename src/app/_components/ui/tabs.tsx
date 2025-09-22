"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

function Tabs({
  className,
  defaultValue = "tab1",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      defaultValue={defaultValue}
      {...props}
    />
  );
}

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List> {
  containerColor?: string;
  indicatorColor?: string;
}

function TabsList({
  className,
  children,
  containerColor = "bg-gray-100",
  indicatorColor = "bg-brand-primary",
  ...props
}: TabsListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateTabPosition = () => {
      const activeButton = buttonsRef.current.find(
        (btn) => btn?.dataset.state === "active",
      );
      const bg = activeRef.current;

      if (activeButton && bg && container) {
        const btnRect = activeButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offsetLeft = btnRect.left - containerRect.left;
        const offsetTop = btnRect.top - containerRect.top;
        const width = btnRect.width;
        const height = btnRect.height;

        bg.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
        bg.style.width = `${width}px`;
        bg.style.height = `${height}px`;
      }
    };

    updateTabPosition();

    const resizeObserver = new ResizeObserver(() => {
      updateTabPosition();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeTab]);

  return (
    <TabsPrimitive.List
      ref={containerRef}
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex w-full items-center justify-start gap-1.5 rounded-lg p-2 text-black",
        containerColor,
        className,
      )}
      {...props}
    >
      <div
        ref={activeRef}
        className={cn(
          "absolute top-0 left-0 rounded-lg transition-all duration-300 ease-in-out",
          indicatorColor,
        )}
        style={{ width: 0, height: 0 }}
      />
      {React.Children.map(children, (child, index) => {
        const childElement = child as React.ReactElement<
          { value: string } & { ref?: React.Ref<HTMLButtonElement> }
        >;
        return React.cloneElement(childElement, {
          ref: (el: HTMLButtonElement | null) => {
            buttonsRef.current[index] = el;
          },
          onClick: () => setActiveTab(childElement.props.value),
        } as Partial<React.ComponentProps<typeof TabsPrimitive.Trigger>>);
      })}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:text-brand-primary relative z-10 inline-flex h-[calc(100%-1px)] w-fit items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm whitespace-nowrap hover:cursor-pointer focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:font-bold lg:text-base [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
