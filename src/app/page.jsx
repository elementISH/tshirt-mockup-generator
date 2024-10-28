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
  // let supportsCopy = !!(navigator && navigator.clipboard);

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
    // setTimeout(() => {
    //   const link = document.createElement("a");
    //   link.href = imageDataUrl;
    //   link.download = "image.png";
    //   link.click();
    // }, 1500); // 1.5 seconds delay
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
          <div className="w-[90%] md:w-[30%]">
            <div className="flex flex-col gap-4">
              <div
                className="w-full relative"
                ref={captureRef}
                style={{ background: background }}
              >
                <div className="absolute top-2 left-4 text-black z-10 p-1 rounded ">
                  color: {background}
                </div>
                <Suspense
                  fallback={<LoaderCircle size={64} className="animate-spin" />}
                >
                  <img src="Tshirt.png" alt="T-shirt" />
                </Suspense>
              </div>
              <div>
                <Picker background={background} setBackground={setBackground} />
              </div>
              <a
                href={imageDataUrl}
                target="_blank"
                download
                style={{ textDecoration: "none" }}
              >
                download here
              </a>
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
                <a
                  href={imageDataUrl}
                  download
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    onClick={handleDownload}
                    className="text-white bg-slate-900 w-full"
                  >
                    Download Image
                  </Button>
                </a>
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
