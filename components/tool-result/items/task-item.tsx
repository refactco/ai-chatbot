import { AsanaLogo } from '@/components/icons/asana-logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckIcon, DotIcon, XIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface IToolObject {
  uid: string;
  status?: 'Accepted' | 'Rejected';
  [key: string]: any;
}

interface ITaskItemProps {
  text: ReactNode;
  toolObject: IToolObject;
  icon?: ReactNode;
  readonly?: boolean;
  onReject?: (toolObject: IToolObject) => void;
  onAccept?: (toolObject: IToolObject) => void;
}

const TaskItem = (props: ITaskItemProps) => {
  const {
    text,
    toolObject,
    icon = <AsanaLogo className="size-3" />,
    readonly = true,
    onReject,
    onAccept,
  } = props;
  const { status, value } = toolObject;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>{icon}</span>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">
              {text}
              {value ? <span>: {value}</span> : null}
            </span>
          </div>
        </div>
        {!readonly ? (
          <div className="flex items-center">
            {status ? (
              <span
                className={cn(
                  'text-muted-foreground text-xs flex items-center gap-1',
                  status === 'Accepted' ? 'text-green-300' : 'text-red-400',
                )}
              >
                {status === 'Accepted' ? (
                  <CheckIcon className="size-3" />
                ) : (
                  <XIcon className="size-3" />
                )}
                {status}
              </span>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500"
                  onClick={() => onReject?.(toolObject)}
                >
                  {toolObject.attributes ? (
                    'Reject All'
                  ) : (
                    <XIcon className="size-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500"
                  onClick={() => onAccept?.(toolObject)}
                >
                  {toolObject.attributes ? (
                    'Accept All'
                  ) : (
                    <CheckIcon className="size-3" />
                  )}
                </Button>
              </>
            )}
          </div>
        ) : null}
      </div>
      {toolObject.attributes ? (
        <div className="flex flex-col gap-1 pl-5">
          {toolObject.attributes.map((attribute: any) => {
            const { label, new: newValue } = attribute;

            return (
              <TaskItem
                key={label}
                icon={<DotIcon className="size-3" />}
                text={
                  <div className="text-xs">
                    <span className="text-neutral-300">{label}:</span>{' '}
                    {newValue}
                  </div>
                }
                toolObject={attribute}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default TaskItem;
