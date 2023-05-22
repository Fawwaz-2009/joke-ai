import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn, useHasHydrated } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import useComediansStore from "~/stores/comedians";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";

export function ComedianSelector({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const hasHydrated = useHasHydrated();
  const { comedians, selectedComedian, setSelectedComedian } = useComediansStore();

  return (
    <div>
      <Label className="block my-2 ">Comedian Selector</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-72 justify-between capitalize" disabled={disabled}>
            {selectedComedian && hasHydrated ? selectedComedian : "Select a Comedian"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0">
          <Command>
            <CommandInput placeholder="Search comedians..." />
            <CommandEmpty>No comedian found.</CommandEmpty>
            <CommandGroup className="">
              <ScrollArea className="h-72">
                {comedians.map((comedian) => (
                  <CommandItem
                    key={comedian}
                    onSelect={(currentValue) => {
                      setSelectedComedian(currentValue === selectedComedian ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="capitalize"
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedComedian === comedian ? "opacity-100" : "opacity-0")} />
                    {comedian}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
