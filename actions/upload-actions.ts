"use server";

import { generateSummaryFromCohere } from "@/lib/coheraai";
import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfSummary(
  uploadResponse: {
    url: string;
    name: string;
  }[]
) {
  if (!uploadResponse || uploadResponse.length === 0) {
    return {
      success: false,
      message: "No files uploaded",
      data: null,
    };
  }

  const { url: pdfUrl, name: fileName } = uploadResponse[0];

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    // console.log("Sending to OpenAI:", pdfText);

    let summary;
    try {
      summary = await generateSummaryFromOpenAI(pdfText);
      console.log("OpenAI Summary Response:", summary);
    } catch (error) {
      console.log(error);
      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        try {
          summary = await generateSummaryFromGemini(pdfText);
        } catch (geminiError) {
          console.log(
            "Gemini API failed after OpenAI quote exceeded",
            geminiError
          );

          try {
            summary = await generateSummaryFromCohere(pdfText);
            console.log("✅ Claude Summary:", summary);
          } catch (coheraError: any) {
            console.error("❌ Claude failed:", coheraError.message);
            throw new Error("All AI providers failed to generate summary.");
          }
          // throw new Error(
          //   "Failed to generate summary with available AI providers"
          // );
        }
      }
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
      data: { summary, fileName, pdfUrl },
    };
  } catch (error) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }
}

// async function savePdfSummary({
//   userId,
//   fileUrl,
//   summary,
//   title,
//   fileName,
// }: PdfSummaryType) {
//   try {
//     const sql = await getDbConnection();
//     await sql`INSERT INTO pdf_summaries (
//   user_id,
//   original_file_url,
//   summary_text,
//   status,
//   title,
//   file_name
// ) VALUES (
//  ${userId}
//  ${fileUrl}
//  ${summary}
//  ${title}
//  ${fileName}
// );
// `;
//   } catch (error) {
//     console.log("Error saving PDF Summary", error);
//   }
// }

// export async function storePdfSumamryAction({
//   fileUrl,
//   summary,
//   title,
//   fileName,
// }:PdfSummaryType) {
//   let savedSummary;
//   try {
//     const { userId } = auth();
//     if (!userId) {
//       return {
//         success: false,
//         message: "user Not found",
//       };
//     }
//     savedSummary = await savedSummary({
//       userId,
//       fileUrl,
//       summary,
//       title,
//       fileName,
//     });

//     if (!savedSummary){
//         return {
//       success: false,
//       message: "error saving pdf summary",
//       data: null,
//     };
//     }

//         return {
//       success: true,
//       message: " pdf summary save successfully",
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: "error saving pdf summary",
//       data: null,
//     };
//   }
// }

export async function storePdfSumamryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }
    const sql = await getDbConnection();

    await sql`
INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
      ) VALUES (
        ${userId},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName}
      );
`;

  
  } catch (error) {
    console.error("Error saving PDF summary:", error);
    return {
      success: false,
      message: "Failed to save PDF summary",
    };
  }

  revalidatePath(`/summaries/`)
    return {
      success: true,
      message: "PDF summary saved successfully",
    };
}
