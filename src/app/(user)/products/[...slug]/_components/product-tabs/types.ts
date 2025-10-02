export type Comment = {
  comment: string;
  created_at: Date;
  id: number;
  is_buyer: boolean;
  suggestion: "پیشنهاد میکنم" | "پیشنهاد نمیکنم";
  title: string;
  user: number;
};

export type CommentsProps = {
  comments: Comment[] | undefined;
};
