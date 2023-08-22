import {
  Button,
  ToastAction,
  useToast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui';
import { Settings } from '@repo/ui/icons';
import { SettingsForm } from './settings-form';

export function SettingsButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Settings className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1">Settings</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="w-[200px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <SettingsForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
