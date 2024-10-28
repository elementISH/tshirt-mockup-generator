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
const ColorPicker = dynamic(() => import("react-color-picker-wheel"), {
  ssr: false,
});
export function Picker({ background, setBackground, className }) {
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

  // State to remember the selected tab
  const [selectedTab, setSelectedTab] = useState("solid");

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
                onClick={() => setBackground(s)}
              />
            ))}
          </TabsContent>

          <TabsContent value="wheel" className="mt-0">
            <div className="flex flex-wrap gap-1 mb-2 justify-items-center justify-center">
              <ColorPicker
                initialColor={background}
                onChange={(color) => setBackground(color.hex)}
                size={300}
              />
            </div>
          </TabsContent>
        </Tabs>

        <Input
          id="custom"
          value={background}
          className="col-span-2 h-8 mt-4"
          onChange={(e) => setBackground(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
