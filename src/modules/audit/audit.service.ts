import { uploadToCloudinary } from "../../config/cloudinary";
import { prisma } from "../../database/prisma";
import { InputType } from "../../generated/prisma";
import { TcreateFileAudit, TCreateSnippet } from "./audit.interface";
import { analyzeCode } from "./utils/aiAnalyzer";
import { isZipBuffer } from "./utils/bufferCheck";
import { extractZipAndRead } from "./utils/zipHandler";


export const createSnippetAudit = async (userId: string, payload: TCreateSnippet) => {
    // AI analysis করো
    const issues = await analyzeCode(payload.snippet);

    const result = await prisma.auditProject.create({
        data: {
            userId,
            name: payload.name || "Snippet Audit",
            inputType: InputType.SNIPPET,
            snippet: payload.snippet,
        }
    });

    // analysis result সহ return করো
    return {
        audit: result,
        issues,
    };
}

export const createFileAudit = async (userId: string, payload: TcreateFileAudit) => {
    let type: InputType = InputType.SINGLE_FILE;
    let files: { filename: string; content: string }[] = [];

    // ZIP detect
    if (isZipBuffer(payload.fileBuffer)) {
        type = InputType.ZIP;
        files = extractZipAndRead(payload.fileBuffer);
    } else {
        files = [{ filename: payload.fileName, content: payload.fileBuffer.toString("utf-8") }];
    }

    const cloudUrl = await uploadToCloudinary(payload.fileBuffer, payload.fileName);

    const auditResults: { fileName: string, issue: any }[] = [];

    for (const file of files) {
        const issue = await analyzeCode(file.content);
        auditResults.push({ fileName: file.filename, issue });
    }

    const audit = await prisma.auditProject.create({
        data: {
            userId,
            name: payload.name || payload.fileName || "File Audit",
            inputType: type,
            fileUrl: type === InputType.SINGLE_FILE ? cloudUrl : undefined,
            zipUrl: type === InputType.ZIP ? cloudUrl : undefined,
            fileName: type === InputType.SINGLE_FILE ? payload.fileName : undefined,
            zipFileName: type === InputType.ZIP ? payload.fileName : undefined,
        },
    });

    return { audit, results: auditResults };
}

export const getUserAudit = async (userId: string) => {
    const audits = await prisma.auditProject.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return audits;
}

export const auditService={
    createSnippetAudit,
    createFileAudit,
    getUserAudit,

}