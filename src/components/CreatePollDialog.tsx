import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { useCreatePoll } from "@/hooks/usePolls";

interface CreatePollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistId: string;
  onPollCreated?: (pollId: string) => void;
}

const CreatePollDialog = ({
  open,
  onOpenChange,
  artistId,
  onPollCreated,
}: CreatePollDialogProps) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");
  
  const createPoll = useCreatePoll();

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    const validOptions = options.filter((opt) => opt.trim());
    
    if (!question.trim() || validOptions.length < 2) {
      return;
    }

    const poll = await createPoll.mutateAsync({
      question,
      options: validOptions,
      artistId,
      expiresAt: expiresAt || undefined,
    });

    if (poll && onPollCreated) {
      onPollCreated(poll.id);
    }

    // Reset form
    setQuestion("");
    setOptions(["", ""]);
    setExpiresAt("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Poll</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="What should I release next?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          <div>
            <Label htmlFor="expiresAt">Expires At (Optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !question.trim() ||
                options.filter((opt) => opt.trim()).length < 2 ||
                createPoll.isPending
              }
            >
              {createPoll.isPending ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollDialog;
