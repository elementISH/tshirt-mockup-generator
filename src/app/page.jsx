"use client";

import { Picker } from "@/components/ui/picker";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function Home() {
  const [background, setBackground] = useState("#334155");
  const captureRef = useRef(null);

  // Effect to apply background color to SVG elements
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

    applyBackgroundColor(); // Call the function to apply color
  }, [background]);

  const copyDivToClipboard = async () => {
    if (!captureRef.current) return;

    try {
      // Capture the div as a canvas
      const canvas = await html2canvas(captureRef.current);

      // Convert canvas to a blob and copy to clipboard
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          toast.success("Image copied to clipboard! Paste to share.");
        }
      }, "image/png");
    } catch (error) {
      toast.error("Failed to copy image, please try again.");
    }
  };

  return (
    <>
      <div className="absolute left-2 top-2 text-white bg-slate-900/50 p-2 rounded-full px-4">
        Made With ❤️ By Ismail Mansour
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
                <img src="Tshirt.png" alt="T-shirt" />
              </div>
              <div>
                <Picker background={background} setBackground={setBackground} />
              </div>
              <button
                onClick={copyDivToClipboard}
                className="text-white px-4 py-2 rounded bg-slate-900"
              >
                Share Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
