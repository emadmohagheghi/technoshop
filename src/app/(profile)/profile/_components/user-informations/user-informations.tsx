"use client";

import { EditName } from "./edit-name";
import NationalCode from "./national-code";

export default function UserInformations() {

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h1 className="text-2xl font-medium">اطلاعات فردی</h1>
        <p className="text-xl text-gray-700">هویت خود را تأیید کنید</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <EditName />
        <NationalCode  />
      </div>
    </div>
  );
}
