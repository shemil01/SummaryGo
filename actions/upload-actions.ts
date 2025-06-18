"use server";

import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";

export async function generatePdfSummary(uploadResponse: {
  serverData: {
    userId: {
      file: {
        url: string;
        name: string;
      };
    };
  };
}) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse;

  if (!pdfUrl) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log(pdfText);
    let summary;
    try {
      summary = await generateSummaryFromOpenAI(pdfText);
      console.log(summary);
    } catch (error) {
      console.log(error);
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }

    return {
      success: true,
      message: "Summary generated successfully",
      data: summary,
    };
  } catch (error) {
    return {
      success: false,
      message: "File processing failed",
      data: null,
    };
  }
}
