"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import useUserConfigsStore from "~/stores/userConfigs";

function UserConfigsForm() {
  const [open, setOpen] = React.useState(false);
  const { openAiAPIKey, setUserSecrets } = useUserConfigsStore();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>User Configs</Button>
        </DialogTrigger>
        <DialogContent>
          <form
            action="#"
            onSubmit={(e) => {
              e.preventDefault();
              const openAiAPIKey = (e.currentTarget.elements.namedItem("openAIKey") as HTMLInputElement).value;
              setUserSecrets({ openAiAPIKey });
              setOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>Your Configs</DialogTitle>
              <DialogDescription>These configs are stored on your device.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="openAIKey">OpenAI API Key</Label>
                <Input id="openAIKey" placeholder="Enter your OpenAI API Key" required defaultValue={openAiAPIKey ?? undefined} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UserConfigsForm;
