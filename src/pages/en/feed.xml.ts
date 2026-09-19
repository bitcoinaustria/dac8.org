import type { APIRoute } from "astro"
import { campaignFeed } from "@/lib/feed"
export const GET: APIRoute = ({ site }) => campaignFeed("en", site!)
