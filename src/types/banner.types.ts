export type Banner = {
  id: number;
  image: Record<string, string>;
  title: string;
  position: "HOME_SLIDER_BANNER" | "HOME_SIDE_BANNER";
  url: string;
  is_external: boolean;
};
