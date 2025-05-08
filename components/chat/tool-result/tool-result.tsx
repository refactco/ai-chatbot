/**
 * Tool Result Component
 *
 * This component renders the results of tool calls in chat messages.
 * Features:
 * - Supports different tool result types (create_task_list, etc.)
 * - Provides interactive UI elements based on tool result type
 * - Consistent styling with the application design system
 * - Accept/reject functionality for task lists
 * - Collapsible user lists with expand/collapse functionality
 *
 * Used to display interactive tool results within chat messages.
 */

import React, { useEffect, useState } from 'react';
import { AsanaLogo } from '../../../components/ui/icons/asana-logo';
import { Button } from '../../../components/ui/button';
import TaskItem, { IToolObject } from './items/task-item';
import { CollapsibleCard } from '../../../components/ui/collapsible-card';

interface Task {
  id?: string;
  name: string;
  description?: string;
  due_on?: string;
  status?: 'Accepted' | 'Rejected';
}

interface ToolResultProps {
  toolCalls: any;
  onAccept?: (toolObject: IToolObject) => void;
  onReject?: (toolObject: IToolObject) => void;
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
}

const ToolResult: React.FC<ToolResultProps> = (props) => {
  const {
    toolCalls,
    onAccept: parentOnAccept,
    onReject: parentOnReject,
    onAcceptAll: parentOnAcceptAll,
    onRejectAll: parentOnRejectAll,
  } = props;
  const { type, items, title } = toolCalls;

  const [toolResultData, setToolResultData] = useState(items);

  useEffect(() => {
    setToolResultData(items);
  }, [items]);

  const handleAccept = (toolObject: IToolObject) => {
    if (Array.isArray(toolResultData)) {
      const updatedData = toolResultData.map((task: any) =>
        task.uid === toolObject.uid ? { ...task, status: 'Accepted' } : task,
      );
      setToolResultData(updatedData);
    } else if (toolResultData?.tasks) {
      const updatedTasks = toolResultData.tasks.map((task: any) =>
        task.uid === toolObject.uid ? { ...task, status: 'Accepted' } : task,
      );
      setToolResultData({ ...toolResultData, tasks: updatedTasks });
    }

    if (parentOnAccept) {
      parentOnAccept(toolObject);
    }
  };

  const handleReject = (toolObject: IToolObject) => {
    if (Array.isArray(toolResultData)) {
      setToolResultData(
        toolResultData.map((task: any) =>
          task.uid === toolObject.uid ? { ...task, status: 'Rejected' } : task,
        ),
      );
    } else if (toolResultData?.tasks) {
      const updatedTasks = toolResultData.tasks.map((task: any) =>
        task.uid === toolObject.uid ? { ...task, status: 'Rejected' } : task,
      );
      setToolResultData({ ...toolResultData, tasks: updatedTasks });
    }

    if (parentOnReject) {
      parentOnReject(toolObject);
    }
  };

  const handleAcceptAll = () => {
    if (Array.isArray(toolResultData)) {
      setToolResultData(
        toolResultData.map((task: any) => ({ ...task, status: 'Accepted' })),
      );
    } else if (toolResultData?.tasks) {
      const updatedTasks = toolResultData.tasks.map((task: any) => ({
        ...task,
        status: 'Accepted',
      }));
      setToolResultData({ ...toolResultData, tasks: updatedTasks });
    }

    if (parentOnAcceptAll) {
      parentOnAcceptAll();
    }
  };

  const handleRejectAll = () => {
    if (Array.isArray(toolResultData)) {
      setToolResultData(
        toolResultData.map((task: any) => ({ ...task, status: 'Rejected' })),
      );
    } else if (toolResultData?.tasks) {
      const updatedTasks = toolResultData.tasks.map((task: any) => ({
        ...task,
        status: 'Rejected',
      }));
      setToolResultData({ ...toolResultData, tasks: updatedTasks });
    }

    if (parentOnRejectAll) {
      parentOnRejectAll();
    }
  };

  if (type === 'request') {
    const tasks = Array.isArray(toolResultData)
      ? toolResultData
      : toolResultData?.tasks || [];

    return (
      <CollapsibleCard
        title={title + 'tool call request title'}
        showAction={tasks.length > 0}
        action={
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-400"
              onClick={handleRejectAll}
            >
              Reject All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-400"
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </>
        }
      >
        {tasks.map((task: any, index: number) => (
          <TaskItem
            key={task.id || index}
            text={task.name}
            toolObject={task}
            onReject={handleReject}
            onAccept={handleAccept}
          />
        ))}
      </CollapsibleCard>
    );
  }

  if (type === 'update_task_list') {
    const tasks = Array.isArray(toolResultData)
      ? toolResultData
      : toolResultData?.tasks || [];

    return (
      <div className="flex flex-col gap-4 w-full">
        {tasks.map((task: any, index: number) => (
          <CollapsibleCard
            key={index}
            title={task.name}
            icon={<AsanaLogo />}
            showAction={task.attributes?.length > 0}
            action={
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400"
                  onClick={handleRejectAll}
                >
                  Reject All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </Button>
              </>
            }
          >
            {task.attributes?.map((attribute: any, attrIndex: number) => (
              <TaskItem
                key={`${task.id || index}-${attrIndex}`}
                text={
                  <div className="flex gap-1 items-center">
                    <span className="text-neutral-300">{attribute.label}:</span>
                    <span>{attribute.new}</span>
                  </div>
                }
                toolObject={attribute}
                onReject={handleReject}
                onAccept={handleAccept}
              />
            ))}
          </CollapsibleCard>
        ))}
      </div>
    );
  }

  if (type === 'result') {
    return (
      <CollapsibleCard title={title} icon={<AsanaLogo />}>
        {toolResultData.map((user: any, index: number) => (
          <TaskItem key={index} text={user.name} toolObject={user} readonly />
        ))}
      </CollapsibleCard>
    );
  }

  return <div>ToolResult</div>;
};

export default ToolResult;
