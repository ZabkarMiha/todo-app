"use client";

import { Calendar1, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  className?: string;
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
}

export function DateTimePicker({
  className,
  value,
  onChange,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-fit justify-between font-normal", className)}
          >
            <Calendar1/>
            {value ? value.toLocaleDateString() : "Select due date"}
            <ChevronDownIcon
              className={`ml-2 h-4 w-4 ${open && "rotate-180"} transition-all duration-500`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            defaultMonth={value!}
            selected={value!}
            onSelect={(e) => {
              onChange(e);
            }}
            numberOfMonths={1}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
