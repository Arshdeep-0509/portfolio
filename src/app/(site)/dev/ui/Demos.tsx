"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  ChoiceChips,
  SegmentedControl,
  SelectableCard,
  Toggle,
} from "@/components/ui/form/Choices";
import { FieldError, Label } from "@/components/ui/form/Field";
import { Input } from "@/components/ui/form/Input";
import { FormWizard } from "@/components/ui/FormWizard";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open modal
      </Button>
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
        variant="solid-ink"
        onClick={() => toast({ type: "success", title: "Sent", description: "A demo toast." })}
      >
        Success toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast({ type: "error", title: "Not sent", description: "A demo error." })}
      >
        Error toast
      </Button>
    </div>
  );
}

type DemoForm = { name: string; kind: string[]; size: string; when: string; nda: boolean };

export function WizardDemo() {
  const { register, trigger, handleSubmit, control, formState } = useForm<DemoForm>({
    defaultValues: { name: "", kind: [], size: "s", when: "soon", nda: false },
  });
  const [done, setDone] = useState(false);
  const values = useWatch({ control });
  if (done) return <p className="text-fg">Submitted (demo only).</p>;

  return (
    <form onSubmit={handleSubmit(() => setDone(true))} noValidate>
      <FormWizard
        submitLabel="Send it over"
        validateStep={async (index) =>
          index === 0 ? trigger("name", { shouldFocus: true }) : true
        }
        review={
          <dl className="grid gap-2 text-small sm:grid-cols-2">
            <dt className="label-mono text-fg-muted">Name</dt>
            <dd>{values.name || "—"}</dd>
            <dt className="label-mono text-fg-muted">Picked</dt>
            <dd>{values.kind?.join(", ") || "—"}</dd>
          </dl>
        }
        steps={[
          {
            id: "one",
            title: "Who are you?",
            content: (
              <div>
                <Label htmlFor="demo-name" required>
                  Name
                </Label>
                <Input
                  id="demo-name"
                  invalid={Boolean(formState.errors.name)}
                  aria-describedby="demo-name-error"
                  {...register("name", { required: "Enter a name to continue." })}
                />
                <FieldError id="demo-name-error">{formState.errors.name?.message}</FieldError>
              </div>
            ),
          },
          {
            id: "two",
            title: "Pick things",
            content: (
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectableCard
                  id="demo-a"
                  title="Option A"
                  description="Checkbox card"
                  value="A"
                  {...register("kind")}
                />
                <SelectableCard
                  id="demo-b"
                  title="Option B"
                  description="Checkbox card"
                  value="B"
                  {...register("kind")}
                />
              </div>
            ),
          },
          {
            id: "three",
            title: "Details",
            content: (
              <div className="space-y-6">
                <SegmentedControl
                  label="Size"
                  name="size"
                  idPrefix="demo-size"
                  options={[
                    { value: "s", label: "Small" },
                    { value: "m", label: "Medium" },
                    { value: "l", label: "Large" },
                  ]}
                  inputProps={register("size")}
                />
                <ChoiceChips
                  label="When"
                  name="when"
                  idPrefix="demo-when"
                  options={[
                    { value: "soon", label: "Soon" },
                    { value: "later", label: "Later" },
                  ]}
                  inputProps={register("when")}
                />
                <Toggle id="demo-nda" label="A toggle" {...register("nda")} />
              </div>
            ),
          },
        ]}
      />
    </form>
  );
}
