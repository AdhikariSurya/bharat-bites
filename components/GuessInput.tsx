"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { ALL_STATES } from "@/data/state-centroids";
import clsx from "clsx";

interface GuessInputProps {
  onGuess: (state: string) => void;
  disabled?: boolean;
}

export function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Command className="relative rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center border-b border-stone-100 px-3" cmdk-input-wrapper="">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Command.Input
            placeholder="Search state..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-stone-400 disabled:cursor-not-allowed disabled:opacity-50"
            onValueChange={setValue}
            disabled={disabled}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
          />
        </div>
        
        {open && value.length > 0 && (
          <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-stone-200 bg-white p-1 shadow-lg">
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              <Command.Empty className="py-6 text-center text-sm">No state found.</Command.Empty>
              {ALL_STATES.map((state) => (
                <Command.Item
                  key={state}
                  value={state}
                  onSelect={() => {
                    onGuess(state);
                    setValue("");
                    setOpen(false);
                  }}
                  className={clsx(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "data-[selected=true]:bg-stone-100 data-[selected=true]:text-stone-900"
                  )}
                >
                  {state}
                </Command.Item>
              ))}
            </Command.List>
          </div>
        )}
      </Command>
    </div>
  );
}

