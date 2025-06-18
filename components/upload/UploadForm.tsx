"use client";
import React from "react";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { generatePdfSummary } from "@/actions/upload-actions";

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

const UploadForm = () => {
  // const {toast} = useToast()
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      // console.error("error occurred while uploading", err);
    },
    onUploadBegin: ({ file }) => {
      // console.log("upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const validatedFields = schema.safeParse({ file });
    console.log(validatedFields);
    if (!validatedFields.success) {
      console.log(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
      );
      return;
    }

    const resp = await startUpload([file]);
    if (!resp) {
      return;
    }

const result = await generatePdfSummary(resp)

const  { data = null, message = null} = result || {}
if (data) {
  // if(data.summary) {

  // }
  
}

  }
  return (
    <section>
      <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
        <UploadFormInput onSubmit={handleSubmit} />
      </div>
    </section>
  );
};

export default UploadForm;
