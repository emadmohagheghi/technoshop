"use client";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/_components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/app/_components/ui/button";
import { ArrowDown2, ArrowUp2 } from "iconsax-reactjs";
import { useQuery } from "@tanstack/react-query";
import { readData } from "@/core/http-service";
import type { ApiFilterResultType } from "@/types/response";
import Comments from "./comments";
import Review from "./review";
import Specifications from "./specifications";
import type { Comment } from "./types";

const MAX_HEIGHT = 640;

type ActiveTab = "comments" | "review" | "specifications";

export default function ProductTabs() {
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButtons, setShouldShowButtons] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("specifications");
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      readData<ApiFilterResultType<Comment>>(
        "/api/catalog/product/comment/list/5/",
      ).then((res) => res.data.data),
  });

  const checkContentHeight = useCallback((tabKey: string) => {
    const contentElement = contentRefs.current[tabKey];
    if (!contentElement) return;

    const contentHeight = contentElement.scrollHeight;

    if (contentHeight > MAX_HEIGHT) {
      setShouldShowButtons(true);
    } else {
      setShouldShowButtons(false);
      setShowMore(false);
    }
  }, []);

  const setupResizeObserver = useCallback(() => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    resizeObserverRef.current = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const tabKey = entry.target.getAttribute("data-tab-key");
        if (tabKey === activeTab) {
          checkContentHeight(tabKey);
        }
      });
    });

    Object.entries(contentRefs.current).forEach(([, element]) => {
      if (element) {
        resizeObserverRef.current?.observe(element);
      }
    });
  }, [activeTab, checkContentHeight]);

  useEffect(() => {
    setupResizeObserver();
    checkContentHeight(activeTab);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [activeTab, setupResizeObserver, checkContentHeight]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as ActiveTab);
    setShowMore(false);
  }, []);

  const handleToggleMore = useCallback(() => {
    setShowMore((prev) => !prev);
  }, []);

  const contentClassName = useMemo(
    () =>
      cn({
        "max-h-160 overflow-hidden": !showMore && shouldShowButtons,
      }),
    [showMore, shouldShowButtons],
  );

  const tabs = useMemo(
    () => [
      {
        id: "specifications",
        label: "مشخصات فنی",
        component: <Specifications />,
      },
      { id: "review", label: "نقد و بررسی", component: <Review /> },
      {
        id: "comments",
        label: "نظرات کاربران",
        component: <Comments comments={comments} />,
      },
    ],
    [comments],
  );

  return (
    <div className="mt-5">
      <Tabs
        dir="rtl"
        value={activeTab}
        onValueChange={handleTabChange}
        className="overflow-hidden"
      >
        <TabsList indicatorColor="bg-brand-primary-content" className="*:p-3">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className={contentClassName}>
            <div
              ref={(el) => {
                contentRefs.current[tab.id] = el;
              }}
              data-tab-key={tab.id}
            >
              {tab.component}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      {shouldShowButtons && (
        <Button variant="link" className="mt-4" onClick={handleToggleMore}>
          {showMore ? (
            <>
              نمایش کمتر
              <ArrowUp2 />
            </>
          ) : (
            <>
              نمایش بیشتر
              <ArrowDown2 />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
