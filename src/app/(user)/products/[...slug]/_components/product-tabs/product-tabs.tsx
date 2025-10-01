"use client";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/_components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { ArrowDown2, ArrowUp2 } from "iconsax-reactjs";
import Comments from "./comments";
import Review from "./review";
import Specifications from "./specifications";

export default function ProductTabs() {
  const [showMore, setShowMore] = useState(false);
  const [shouldShowButtons, setShouldShowButtons] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const checkContentHeight = (tabKey: string) => {
    const contentElement = contentRefs.current[tabKey];
    if (!contentElement) return;

    const contentHeight = contentElement.scrollHeight;
    const maxHeight = 640;

    if (contentHeight > maxHeight) {
      setShouldShowButtons(true);
    } else {
      setShouldShowButtons(false);
      setShowMore(false);
    }
  };

  const setupResizeObserver = () => {
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

    Object.entries(contentRefs.current).forEach(([_, element]) => {
      if (element) {
        resizeObserverRef.current?.observe(element);
      }
    });
  };

  useEffect(() => {
    setupResizeObserver();
    checkContentHeight(activeTab);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [activeTab, setupResizeObserver, checkContentHeight]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      checkContentHeight(activeTab);
    });
    return () => cancelAnimationFrame(id);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowMore(false);
  };

  return (
    <div className="mt-5">
      <Tabs
        dir="rtl"
        value={activeTab}
        onValueChange={handleTabChange}
        className="overflow-hidden"
      >
        <TabsList
          indicatorColor="bg-brand-primary-content"
          className="*:p-3"
        >
          <TabsTrigger value="tab1">مشخصات فنی</TabsTrigger>
          <TabsTrigger value="tab2">نقد و بررسی</TabsTrigger>
          <TabsTrigger value="tab3">نظرات کاربران</TabsTrigger>
        </TabsList>
        <TabsContent
          value="tab1"
          className={cn({
            "max-h-160 overflow-hidden": !showMore && shouldShowButtons,
          })}
        >
          <div
            ref={(el) => {
              contentRefs.current["tab1"] = el;
            }}
            data-tab-key="tab1"
          >
            <Specifications />
          </div>
        </TabsContent>
        <TabsContent
          value="tab2"
          className={cn({
            "max-h-160 overflow-hidden": !showMore && shouldShowButtons,
          })}
        >
          <div
            ref={(el) => {
              contentRefs.current["tab2"] = el;
            }}
            data-tab-key="tab2"
          >
            <Review />
          </div>
        </TabsContent>
        <TabsContent
          value="tab3"
          className={cn({
            "max-h-160 overflow-hidden": !showMore && shouldShowButtons,
          })}
        >
          <div
            ref={(el) => {
              contentRefs.current["tab3"] = el;
            }}
            data-tab-key="tab3"
          >
            <Comments />
          </div>
        </TabsContent>
      </Tabs>
      {shouldShowButtons &&
        (showMore ? (
          <Button
            variant="link"
            className="mt-4"
            onClick={() => setShowMore(false)}
          >
            نمایش کمتر
            <ArrowUp2 />
          </Button>
        ) : (
          <Button
            variant="link"
            className="mt-4"
            onClick={() => setShowMore(true)}
          >
            نمایش بیشتر
            <ArrowDown2 />
          </Button>
        ))}
    </div>
  );
}
