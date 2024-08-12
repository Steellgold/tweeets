import { Textarea } from "@nextui-org/input";
import { ChangeEventHandler } from "react";

interface TextareaComponentProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined
}

export const TextareaComponent: React.FC<TextareaComponentProps> = ({ value, onChange }) => (
  <div id="onborda-step1">
    <Textarea 
      required 
      className="w-full" 
      label="What is your tweet about?" 
      placeholder="Type a context for your tweet"
      value={value}
      onChange={onChange}
    />
  </div>
);
