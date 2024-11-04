"use client";

import { Picker } from "@/components/ui/picker";
import { useEffect, useState, useRef, Suspense } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import shadcn Dialog components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
function dataURItoBlob(dataurl) {
  if (!dataurl) return;
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

async function checkCompatibility() {
  try {
    const { state } = await navigator.permissions.query({
      name: "clipboard-write",
    });
    return state === "granted";
  } catch (error) {
    return false;
  }
}

export default function Page() {
  const [background, setBackground] = useState("#334155");
  const [showDialog, setShowDialog] = useState(false); // Track dialog visibility
  const [imageDataUrl, setImageDataUrl] = useState(null); // Store the image data URL
  const [supportsCopy, setSupportsCopy] = useState(false); // Check for support
  const captureRef = useRef(null);

  useEffect(() => {
    const applyBackgroundColor = () => {
      if (captureRef.current) {
        const colorElements = captureRef.current.querySelectorAll(
          "[data-group='color']"
        );
        colorElements.forEach((element) => {
          element.style.fill = background;
        });
      }
    };

    applyBackgroundColor();
  }, [background]);

  const copyDivToClipboard = async () => {
    if (!captureRef.current) return;
    setSupportsCopy(await checkCompatibility());
    try {
      const canvas = await html2canvas(captureRef.current);
      const dataUrl = canvas.toDataURL("image/png");

      setImageDataUrl(dataUrl); // Set image data URL for dialog display
      setShowDialog(true); // Open dialog
    } catch (error) {
      toast.error("Failed to capture image, please try again.");
    }
  };

  const handleDownload = async () => {
    if (!imageDataUrl) return;

    // Show toast and delay download
    toast.info("Preparing image for download...");

    // Convert data URI to Blob
    const blob = dataURItoBlob(imageDataUrl);
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.png"; // Specify the file name

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Revoke the object URL after download
  };

  const handleCopyToClipboard = async () => {
    if (!imageDataUrl) return;

    try {
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("Image copied to clipboard! Paste to share.");
    } catch (error) {
      toast.error("Failed to copy image, please try again.");
    }
  };

  return (
    <>
      <div className="absolute left-5 top-3 text-white bg-slate-900/50 p-2 rounded-full px-4">
        Made With ❤️ By <span className="underline">Ismail Mansour</span>
      </div>
      <div className="h-screen w-screen grid place-items-center bg-slate-700 overflow-hidden">
        <div className="grid place-items-center">
          <div className="w-[90%] md:w-[30%] mt-14 md:mt-0">
            <div className="flex flex-col gap-4">
              <div
                className="w-full relative"
                // style={{ background: background }}
              >
                <Suspense
                  fallback={<LoaderCircle size={64} className="animate-spin" />}
                >
                  <Tabs defaultValue="polo">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="polo">polo</TabsTrigger>
                      <TabsTrigger value="hoodie">hoodie</TabsTrigger>
                    </TabsList>
                    <div ref={captureRef} className="relative">
                      <div className="absolute top-5 left-4 text-black z-10 p-1 rounded ">
                        color: {background}
                      </div>
                      <TabsContent value="polo">
                        <img
                          src={"/Tshirt.webp"}
                          alt="Polo Shirt"
                          priority={true}
                          loading={"eager"}
                          style={{
                            width: "100%",
                            height: "auto",
                            background: background,
                          }}
                        />
                      </TabsContent>
                      <TabsContent value="hoodie">
                        <img
                          src={"/hoodie.webp"}
                          alt="Hoodie"
                          priority={true}
                          quality={100}
                          loading={"eager"}
                          style={{
                            width: "100%",
                            height: "auto",
                            background: background,
                          }}
                        />
                      </TabsContent>
                    </div>
                  </Tabs>
                </Suspense>
              </div>
              <div>
                <Picker background={background} setBackground={setBackground} />
              </div>

              <Button
                onClick={copyDivToClipboard}
                className="text-white bg-slate-900"
              >
                Share Image
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for displaying the image */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generated T-shirt Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <img
              src={imageDataUrl}
              alt="T-shirt"
              className="max-w-full max-h-[70vh] object-contain"
            />
            <div className="flex gap-1 w-full">
              <div
                className={`flex flex-col gap-2 w-${
                  supportsCopy ? "1/2" : "full"
                }`}
              >
                {!supportsCopy && (
                  <p className="text-xs text-gray-600">
                    Long press the image to copy it. Alternatively, you can
                    download it by clicking below.
                  </p>
                )}
                <Button
                  onClick={handleDownload}
                  className="text-white bg-slate-900 w-full"
                >
                  Download Image
                </Button>
              </div>
              {supportsCopy && (
                <Button
                  onClick={handleCopyToClipboard}
                  className="text-white bg-slate-900 w-1/2"
                >
                  Copy Image To Clipboard
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
