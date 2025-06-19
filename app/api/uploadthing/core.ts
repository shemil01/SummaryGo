import { metadata } from "@/app/layout";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("unauthorized");
      return { userId: user.id };
    })
.onUploadComplete(async ({ metadata, file }) => {
  console.log("Upload completed successfully");
  console.log("File URL:", file.url);
  return { status: "success" };
})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;