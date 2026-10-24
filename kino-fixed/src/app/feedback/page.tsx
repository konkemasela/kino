import type { Metadata } from "next";
import FeedbackForm from "@/features/catalog/components/feedback-form";

export const metadata: Metadata = { title: "Feedback", description: "Send a suggestion or report an issue with Kinooz." };

export default function FeedbackPage() { return <FeedbackForm />; }
