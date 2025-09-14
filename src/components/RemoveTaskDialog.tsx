import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RemoveTaskDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  taskTitle?: string;
  loading?: boolean;
}

const RemoveTaskDialog: React.FC<RemoveTaskDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  taskTitle,
  loading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task?</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-sm text-gray-700 dark:text-gray-300">
          Are you sure you want to delete
          <span className="font-semibold text-red-600">
            {" "}
            {taskTitle ? `"${taskTitle}"` : "this task"}
          </span>
          ?
          <br />
          This action cannot be undone.
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading && (
              <svg
                className="inline-block w-4 h-4 mr-2 text-white animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveTaskDialog;
