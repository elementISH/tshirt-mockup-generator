"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { hsvaToHex, hexToHsva } from "@uiw/color-convert"; // Import hex to HSVA converter
const ShadeSlider = dynamic(() => import("@uiw/react-color-shade-slider"), {
  ssr: false,
});
const Wheel = dynamic(() => import("@uiw/react-color-wheel"), {
  ssr: false,
});
const solids = [
  "#2c5346",
  "#22493C",
  "#213f35",
  "#800220",
  "#9f88a2",
  "#7856a0",
  "#493362",
  "#A2CFFE",
  "#92bce2",
  "#247082",
  "#101213",
];

export function Picker({ background, setBackground, className }) {
  const [selectedTab, setSelectedTab] = useState("solid");
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });

  const isValidHex = (hex) => {
    const cleanedHex = hex.replace("#", "");
    return cleanedHex.length === 3 || cleanedHex.length === 6;
  };

  const handleColorChange = (color) => {
    setHsva({ ...hsva, ...color.hsva });
    const hexColor = hsvaToHex({ ...hsva, ...color.hsva });
    setBackground(hexColor);
  };

  const handleSetBackground = (newColor) => {
    setBackground(newColor);
    if (isValidHex(newColor)) {
      setHsva(hexToHsva(newColor)); // Update hsva to match the new color
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">
              {background ? background : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full select-none">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab} // Update selected tab on change
          className="w-full"
        >
          <TabsList className="w-full mb-4">
            <TabsTrigger className="flex-1" value="solid">
              Solid
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="wheel">
              Wheel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => handleSetBackground(s)} // Use helper to update color
              />
            ))}
          </TabsContent>

          <TabsContent value="wheel" className="mt-0">
            <div className="flex flex-wrap gap-1 mb-2 justify-items-center justify-center">
              <div className="flex flex-col gap-1 items-center">
                <Wheel color={hsva} onChange={handleColorChange} />
                <ShadeSlider
                  hsva={hsva}
                  style={{ width: 220, marginTop: 20 }}
                  onChange={(newShade) => {
                    setHsva({ ...hsva, ...newShade });
                    setBackground(hsvaToHex({ ...hsva, ...newShade }));
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Input
          id="custom"
          value={background}
          className="col-span-2 h-8 mt-4"
          onChange={(e) => handleSetBackground(e.currentTarget.value)} // Use helper to update color
        />
      </PopoverContent>
    </Popover>
  );
}
