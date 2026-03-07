import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catch-async";
import { TCreateSnippet, TcreateFileAudit } from "./audit.interface";
import { sendResponse } from "../../shared/utils/send-response";
import { auditService } from "./audit.service";




export const createSnippetAudit = catchAsync(async (req: Request, res: Response) => {
    const userId=req.user.id;
     const payload = req.body as TCreateSnippet;
     const result = await auditService.createSnippetAudit(userId, payload);
     sendResponse(res, {
        status: 201,
        success: true,
        message: "Snippet audit created successfully",
        data: result,
     });
});

export const createFileAudit = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
        return sendResponse(res, {
            status: 400,
            success: false,
            message: "No file uploaded",
        });
    }

    const result = await auditService.createFileAudit(userId, {
      fileBuffer: file.buffer,
      fileName: file.originalname,
      name: req.body.name,
    });
    
    sendResponse(res, {
        status: 201,
        success: true,
        message: "File audit created successfully",
        data: result,
    });
});

export const getUserAudit = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await auditService.getUserAudit(userId);
      sendResponse(res, {
        status: 201,
        success: true,
        message: "File audit created successfully",
        data: result,
    });
});


const AuditController = {
    createSnippetAudit,
    createFileAudit,
    getUserAudit
};

export default AuditController;