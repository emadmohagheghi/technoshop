export type UserInfo = {
  full_name: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  national_code: string | null;
  is_superuser: boolean;
  is_verify: boolean;
  has_password: boolean;
  search_histories: [
    {
      id: number;
      search: string;
    },
  ][];
};
