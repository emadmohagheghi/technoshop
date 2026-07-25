"use client";

import { EditName } from "./edit-name";
import NationalCode from "./national-code";

export default function UserInformations() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <EditName />
        <NationalCode />
      </div>
    </div>
  );
}
