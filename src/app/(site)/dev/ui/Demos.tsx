"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Example dialog"
        description="Tab stays inside. Esc, the × button or a click on the backdrop closes it."
      >
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setOpen(false)}>Confirm</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

export function ToastDemo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            type: "success",
            title: "Message sent",
            description: "I'll reply within [RESPONSE_TIME].",
          })
        }
      >
        Success toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            type: "error",
            title: "Something went wrong",
            description: "Please try again or email me.",
          })
        }
      >
        Error toast
      </Button>
    </div>
  );
}
