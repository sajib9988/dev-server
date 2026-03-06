import fs from "fs"; 
// Node.js file system module → file read/write, folder create/delete করার জন্য

import path from "path"; 
// file path handle করার জন্য (cross platform safe path)

import AdmZip from "adm-zip"; 
// zip file read / extract করার library

import { tmpdir } from "os"; 
// operating system এর temporary directory path দেয়


export const extractZipAndRead = (zipBuffer: Buffer) => {

  // zipBuffer থেকে zip object তৈরি
  const zip = new AdmZip(zipBuffer);

  // OS temporary folder এর ভিতরে একটি unique folder তৈরি
  const tempDir = path.join(tmpdir(), "extract_" + Date.now());

  // folder তৈরি (recursive:true মানে nested folder হলেও create করবে)
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    // zip file extract করে tempDir এ রাখবে
    zip.extractAllTo(tempDir, true);
  } catch (error) {
    // extract fail করলে error throw করবে
    throw new Error("Failed to extract zip file: " + error);
  }

  // কোন ধরনের file পড়বে (allowed extensions)
  const exts = [
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".py",
    ".html",
    ".css",
    ".json",
    ".xml",
    ".txt",
  ];

  // সব file content store করার জন্য array
  const files: { filename: string; content: string }[] = [];

  // directory recursively scan করার function
  const walkDir = (dir: string) => {

    // directory এর সব item পড়বে
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {

      // full file path তৈরি
      const fullPath = path.join(dir, item.name);

      // যদি folder হয় → recursive scan
      if (item.isDirectory()) {
        walkDir(fullPath);

      // যদি file হয় এবং extension allowed list এ থাকে
      } else if (exts.includes(path.extname(fullPath))) {

        // file content read
        const content = fs.readFileSync(fullPath, "utf-8");

        // filename এবং content array তে push
        files.push({
          filename: item.name,
          content,
        });
      }
    }
  };

  // root temp folder scan শুরু
  walkDir(tempDir);

  // কাজ শেষ হলে temporary folder delete
  fs.rmSync(tempDir, { recursive: true, force: true });

  // সব file content return করবে
  return files;
};