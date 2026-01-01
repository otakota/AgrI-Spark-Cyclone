import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/_utils/next-auth-options";

export function auth() {
  // App Routerでも Route Handlerでも動く形にする
  return getServerSession(nextAuthOptions);
}
