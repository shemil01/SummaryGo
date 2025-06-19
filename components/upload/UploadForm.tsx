"use client";
import React from "react";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import {
  generatePdfSummary,
  storePdfSumamryAction,
} from "@/actions/upload-actions";
import { UploadButton } from "@bytescale/upload-widget-react";
import { Button } from "../ui/button";
import { formatFileNameAsTitle } from "@/utils/format-text";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "File size must be less than 20MB",
    })
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});
type UploadedFile = {
  fileUrl: string;
  originalFile: {
    originalFileName: string;
  };
};

const UploadForm = () => {
  // const {toast} = useToast()

  const options = {
    apiKey: "public_G22nhnmCNbgJgt6R12nz79mvrKW2", // Get this from Bytescale Dashboard
    maxFileCount: 1,
    maxFileSizeBytes: 20 * 1024 * 1024, // 20MB
    mimeTypes: ["application/pdf"],
    showFinishButton: true,
    styles: {
      colors: {
        primary: "#000000",
        active: "#1f2937",
        error: "#dc2626",
      },
    },
  };

  const onComplete = async (files:UploadedFile[]) => {
    if (!files || files.length === 0) return;

    const uploadedFile = files[0];

    // console.log("resultFile::", uploadedFile);

    const result = await generatePdfSummary([
      {
        url: uploadedFile.fileUrl,
        name: uploadedFile.originalFile.originalFileName,
      },
    ]);
      console.log("PDF name:", result);

    const { data = null, message = null } = result || {};
    if (data) {
      const formateName = formatFileNameAsTitle(uploadedFile.originalFile.originalFileName)
      console.log("PDF summary:", data);
      // Optionally set in state and display to user
      if (data.summary) {
        await storePdfSumamryAction({
          fileUrl: uploadedFile.fileUrl,
          summary: data.summary,
          title: formateName ,
          fileName: data.fileName || uploadedFile.originalFile.originalFileName,
        });
      }
    } else {
      console.error("Error generating summary:", message);
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
        {/* <UploadFormInput onSubmit={handleSubmit} /> */}

        <UploadButton options={options} onComplete={onComplete}>
          {({ onClick }) => <Button onClick={onClick}>Upload your PDF</Button>}
        </UploadButton>
      </div>
    </section>
  );
};

export default UploadForm;
