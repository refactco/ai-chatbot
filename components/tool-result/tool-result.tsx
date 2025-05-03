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
import { AsanaLogo } from '../icons/asana-logo';
import { Button } from '../ui/button';
import TaskItem, { IToolObject } from './items/task-item';
import ToolResultLayout from './layout';

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

  // State to track the tool result data with status updates
  const [toolResultData, setToolResultData] = useState(items);

  // Update internal state when toolResult prop changes
  useEffect(() => {
    setToolResultData(items);
  }, [items]);

  // Handler for accepting a task
  const handleAccept = (toolObject: IToolObject) => {
    console.log({ toolObject, toolResultData });
    // Update internal state
    if (Array.isArray(toolResultData)) {
      const ss = toolResultData.map((task: any) =>
        task.uid === toolObject.uid ? { ...task, status: 'Accepted' } : task,
      );

      setToolResultData(ss);
    } else if (toolResultData?.tasks) {
      console.log({ tasks: toolResultData.tasks });
      const updatedTasks = toolResultData.tasks.map((task: any) =>
        task.uid === toolObject.uid ? { ...task, status: 'Accepted' } : task,
      );
      setToolResultData({ ...toolResultData, tasks: updatedTasks });
    }

    // Call parent handler if provided
    if (parentOnAccept) {
      parentOnAccept(toolObject);
    }
  };

  // Handler for rejecting a task
  const handleReject = (toolObject: IToolObject) => {
    // Update internal state
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

    // Call parent handler if provided
    if (parentOnReject) {
      parentOnReject(toolObject);
    }
  };

  // Handler for accepting all tasks
  const handleAcceptAll = () => {
    // Update internal state
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

    // Call parent handler if provided
    if (parentOnAcceptAll) {
      parentOnAcceptAll();
    }
  };

  // Handler for rejecting all tasks
  const handleRejectAll = () => {
    // Update internal state
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

    // Call parent handler if provided
    if (parentOnRejectAll) {
      parentOnRejectAll();
    }
  };

  if (type === 'request') {
    // Handle both formats: data as array or as object with tasks property
    const tasks = Array.isArray(toolResultData)
      ? toolResultData
      : toolResultData?.tasks || [];

    return (
      <ToolResultLayout
        title={title}
        showAction={tasks.length > 0}
        // mainIcon={<AsanaLogo />}
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
      </ToolResultLayout>
    );
  }

  if (type === 'update_task_list') {
    // Handle both formats: data as array or as object with tasks property
    const tasks = Array.isArray(toolResultData)
      ? toolResultData
      : toolResultData?.tasks || [];

    return (
      <div className="flex flex-col gap-4 w-full">
        {tasks.map((task: any, index: number) => (
          <ToolResultLayout
            key={index}
            title={task.name}
            mainIcon={<AsanaLogo />}
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
          </ToolResultLayout>
        ))}
      </div>
    );
  }

  if (type === 'result') {
    const users = Array.isArray(toolResultData) ? toolResultData : [];

    return (
      <ToolResultLayout title={title} mainIcon={<AsanaLogo />}>
        {users.map((user: any, index: number) => (
          <TaskItem key={index} text={user.name} toolObject={user} readonly />
        ))}
      </ToolResultLayout>
    );
  }

  return <div>ToolResult</div>;
};

export default ToolResult;
