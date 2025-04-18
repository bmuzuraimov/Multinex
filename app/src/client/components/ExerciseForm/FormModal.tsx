import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { AVAILABLE_MODELS } from '../../../shared/constants';
import { ExerciseFormContentSettings, ExerciseFormGenerationSettings, SensoryMode } from '../../../shared/types';
import { cn } from '../../../shared/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../shadcn/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/components/ui/select";
import { Button } from "../../shadcn/components/ui/button";
import { Label } from "../../shadcn/components/ui/label";
import { Card, CardContent } from "../../shadcn/components/ui/card";
import { Separator } from "../../shadcn/components/ui/separator";
import { Badge } from "../../shadcn/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../../shadcn/components/ui/tooltip";

import { 
  FileText, 
  ChevronDown, 
  Info, 
  Loader2, 
  Settings,
  Brain,
  FileQuestion,
  Ear,
  Keyboard,
  Pencil,
  Sparkles
} from 'lucide-react';

type FormModalProps = {
  on_generate: () => void;
  on_discard: () => void;
  loading_status: string;
  is_uploading: boolean;
  exercise_settings: ExerciseFormContentSettings;
  advanced_settings: ExerciseFormGenerationSettings;
};

const FormModal: React.FC<FormModalProps> = ({
  on_generate,
  on_discard,
  loading_status,
  is_uploading,
  exercise_settings,
  advanced_settings,
}) => {
  const [show_advanced, setShowAdvanced] = useState(false);
  const modal_root = document.getElementById('modal-root');
  if (!modal_root) return null;

  const handleToggleMode = (mode: SensoryMode) => {
    const already_selected = exercise_settings.sensory_modes.includes(mode);
    if (already_selected && exercise_settings.sensory_modes.length === 1) return;

    const updated_modes = already_selected
      ? exercise_settings.sensory_modes.filter((m: SensoryMode) => m !== mode)
      : [...exercise_settings.sensory_modes, mode];

    exercise_settings.set_sensory_modes(updated_modes);
  };

  const getModeIcon = (mode: SensoryMode) => {
    switch (mode) {
      case 'listen': return <Ear className="w-4 h-4" />;
      case 'type': return <Keyboard className="w-4 h-4" />;
      case 'write': return <Pencil className="w-4 h-4" />;
      case 'mermaid': return <Sparkles className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleGenerate = () => {
    if (exercise_settings.selected_topics.length === 0) {
      toast.warning('Please select at least one topic before generating the exercise');
      return;
    }
    on_generate();
  };

  return ReactDOM.createPortal(
    <TooltipProvider>
      <Dialog open={true} onOpenChange={() => on_discard()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-manrope text-title-lg font-semibold text-gray-900">
                {exercise_settings.exercise_name}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('/account', '_blank')}
                className="text-primary-600 hover:text-primary-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize Prompt
              </Button>
            </div>
          </DialogHeader>

          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Topics */}
              <div className="space-y-3">
                <Label className="font-montserrat text-sm text-gray-700">
                  Topics
                </Label>
                <div className="flex flex-wrap gap-2">
                  {exercise_settings.topics.map((topic) => (
                    <Badge
                      key={topic}
                      variant={exercise_settings.selected_topics.includes(topic) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        exercise_settings.selected_topics.includes(topic)
                          ? "bg-primary-500 hover:bg-primary-600"
                          : "hover:border-primary-300"
                      )}
                      onClick={() => {
                        const updated_knowledge = exercise_settings.selected_topics.includes(topic)
                          ? exercise_settings.selected_topics.filter((k: string) => k !== topic)
                          : [...exercise_settings.selected_topics, topic];
                        exercise_settings.set_selected_topics(updated_knowledge);
                      }}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />
              {/* Model Selection and MC Quiz */}
              <div className="flex gap-3">
                <Select
                  value={advanced_settings.selected_model}
                  onValueChange={(value) => advanced_settings.set_selected_model(value)}
                >
                  <SelectTrigger className="font-satoshi">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((model) => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={advanced_settings.include_mc_quiz ? "default" : "outline"}
                  className={cn(
                    "flex-1",
                    advanced_settings.include_mc_quiz 
                      ? "bg-primary-500 hover:bg-primary-600 text-white"
                      : "border-primary-200 hover:bg-primary-50 hover:border-primary-300 text-primary-700"
                  )}
                  onClick={() => advanced_settings.set_include_mc_quiz(!advanced_settings.include_mc_quiz)}
                >
                  <FileQuestion className="w-4 h-4 mr-2" />
                  Include MC Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={on_discard}
              className="font-satoshi"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={is_uploading}
              className={cn(
                "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 font-satoshi",
                is_uploading && "opacity-50 cursor-not-allowed"
              )}
            >
              {is_uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {is_uploading ? loading_status : 'Generate Exercise'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>,
    modal_root
  );
};

export default FormModal;
