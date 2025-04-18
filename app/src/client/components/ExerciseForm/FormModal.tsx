import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { EXERCISE_LENGTHS, EXERCISE_LEVELS, AVAILABLE_MODELS } from '../../../shared/constants';
import { ExerciseFormContentSettings, ExerciseFormGenerationSettings, SensoryMode } from '../../../shared/types';
import { cn } from '../../../shared/utils';

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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../shadcn/components/ui/collapsible";
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
              {/* Length and Level Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-montserrat text-sm text-gray-700">
                      Exercise Length
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Exercise length varies by level; higher levels require more words.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select 
                    value={exercise_settings.exercise_length}
                    onValueChange={(value) => exercise_settings.set_exercise_length(value)}
                  >
                    <SelectTrigger className="font-satoshi">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EXERCISE_LENGTHS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-montserrat text-sm text-gray-700">
                    Exercise Level
                  </Label>
                  <Select
                    value={exercise_settings.exercise_level}
                    onValueChange={(value) => exercise_settings.set_exercise_level(value)}
                  >
                    <SelectTrigger className="font-satoshi">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EXERCISE_LEVELS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Prior Knowledge */}
              <div className="space-y-3">
                <Label className="font-montserrat text-sm text-gray-700">
                  Prior Knowledge (Optional)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {exercise_settings.topics.map((topic) => (
                    <Badge
                      key={topic}
                      variant={exercise_settings.prior_knowledge.includes(topic) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        exercise_settings.prior_knowledge.includes(topic)
                          ? "bg-primary-500 hover:bg-primary-600"
                          : "hover:border-primary-300"
                      )}
                      onClick={() => {
                        const updated_knowledge = exercise_settings.prior_knowledge.includes(topic)
                          ? exercise_settings.prior_knowledge.filter((k: string) => k !== topic)
                          : [...exercise_settings.prior_knowledge, topic];
                        exercise_settings.set_prior_knowledge(updated_knowledge);
                      }}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Learning Modes */}
              <div className="space-y-3">
                <Label className="font-montserrat text-sm text-gray-700">
                  Learning Modes
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {(['mermaid', 'listen', 'type', 'write'] as SensoryMode[]).map((mode) => (
                    <Button
                      key={mode}
                      variant={exercise_settings.sensory_modes.includes(mode) ? "default" : "outline"}
                      className={cn(
                        "w-full justify-center gap-2 capitalize",
                        exercise_settings.sensory_modes.includes(mode) && {
                          'mermaid': 'bg-primary-500 hover:bg-primary-600',
                          'listen': 'bg-listen text-primary-900 hover:bg-listen/90',
                          'type': 'bg-type text-primary-900 hover:bg-type/90',
                          'write': 'bg-write text-primary-900 hover:bg-write/90',
                        }[mode]
                      )}
                      onClick={() => handleToggleMode(mode)}
                    >
                      {getModeIcon(mode)}
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Include Summary / MC Quiz */}
              <div className="flex gap-3">
                <Button
                  variant={advanced_settings.include_summary ? "default" : "outline"}
                  className={cn(
                    "flex-1",
                    advanced_settings.include_summary 
                      ? "bg-primary-500 hover:bg-primary-600 text-white"
                      : "border-primary-200 hover:bg-primary-50 hover:border-primary-300 text-primary-700"
                  )}
                  onClick={() => advanced_settings.set_include_summary(!advanced_settings.include_summary)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Include Summary
                </Button>
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

              {/* Advanced Options */}
              <Collapsible open={show_advanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-center gap-2">
                    <Brain className="w-4 h-4" />
                    Advanced Options
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      show_advanced && "rotate-180"
                    )} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2">
                        <Label className="font-montserrat text-sm text-gray-700">
                          Model Selection
                        </Label>
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
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
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
              onClick={on_generate}
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
