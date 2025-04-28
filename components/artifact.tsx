import type { Attachment, UIMessage, UseChatHelpers } from '@/lib/ai/types';
import { formatDistance } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type Dispatch,
  memo,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useDebounceCallback, useWindowSize } from 'usehooks-ts';
import type { Document, Vote } from '@/lib/schema';
import { fetcher } from '@/lib/utils';
import { MultimodalInput } from './multimodal-input';
import { Toolbar } from './toolbar';
import { VersionFooter } from './version-footer';
import { ArtifactActions } from './artifact-actions';
import { ArtifactCloseButton } from './artifact-close-button';
import { ArtifactMessages } from './artifact-messages';
import { useSidebar } from './ui/sidebar';
import { useArtifact } from '@/hooks/use-artifact';
import { imageArtifact } from '@/artifacts/image/client';
import { sheetArtifact } from '@/artifacts/sheet/client';
import { textArtifact } from '@/artifacts/text/client';
import equal from 'fast-deep-equal';

export const artifactDefinitions = [textArtifact, imageArtifact, sheetArtifact];
export type ArtifactKind = (typeof artifactDefinitions)[number]['kind'];

export interface UIArtifact {
  title: string;
  documentId: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: 'streaming' | 'idle';
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface ArtifactProps {
  chatId: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  handleSubmit: any;
  status: any;
  stop: any;
  attachments: any;
  setAttachments: any;
  append: any;
  messages: any;
  setMessages: any;
  reload: any;
  isReadonly: boolean;
}

function PureArtifact({
  chatId,
  input,
  setInput,
  handleSubmit,
  status,
  stop,
  attachments,
  setAttachments,
  append,
  messages,
  setMessages,
  reload,
  votes,
  isReadonly,
}: {
  chatId: string;
  input: string;
  setInput: UseChatHelpers['setInput'];
  status: UseChatHelpers['status'];
  stop: UseChatHelpers['stop'];
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  votes?: Array<Vote> | undefined;
  append: UseChatHelpers['append'];
  handleSubmit: UseChatHelpers['handleSubmit'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
}) {
  const { artifact, setArtifact, metadata, setMetadata } = useArtifact();

  // Handle special document IDs with the 'local:' prefix
  const actualDocumentId = useMemo(() => {
    if (artifact.documentId?.startsWith('local:')) {
      // Extract the original ID without the 'local:' prefix
      return artifact.documentId.substring(6);
    }
    return artifact.documentId;
  }, [artifact.documentId]);

  // We need to handle all types of artifacts consistently for version history to work
  // For special document IDs, we'll use the content directly from artifact rather than API
  const shouldFetchDocument = actualDocumentId && actualDocumentId !== 'init';

  // For local resources, don't attempt API calls, but create local document structures
  const useLocalDocument =
    shouldFetchDocument &&
    (actualDocumentId.startsWith('http') ||
      actualDocumentId.includes('placehold.co') ||
      actualDocumentId.startsWith('text:') ||
      actualDocumentId.startsWith('sheet:'));

  // Get local document versions from localStorage
  const localStorageKey = useMemo(
    () => `local-document-${actualDocumentId}`,
    [actualDocumentId],
  );

  // Load document versions from localStorage on first render
  const loadLocalDocuments = useCallback(() => {
    if (useLocalDocument) {
      try {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
          const parsedData = JSON.parse(storedData) as Document[];
          return parsedData;
        }
      } catch (error) {
        console.error('Error loading local documents:', error);
      }
    }

    // If no stored data, create initial version with current content
    if (useLocalDocument && artifact.content) {
      const initialDocument = {
        id: actualDocumentId,
        kind: artifact.kind as ArtifactKind,
        title: artifact.title,
        content: artifact.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'local-user',
      };
      return [initialDocument];
    }

    return undefined;
  }, [
    useLocalDocument,
    localStorageKey,
    actualDocumentId,
    artifact.kind,
    artifact.title,
    artifact.content,
  ]);

  // Create a local document array for special document types
  const [localDocuments, setLocalDocuments] = useState<Document[] | undefined>(
    loadLocalDocuments,
  );

  // Save local documents to localStorage when they change
  useEffect(() => {
    if (useLocalDocument && localDocuments) {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(localDocuments));
      } catch (error) {
        console.error('Error saving local documents:', error);
      }
    }
  }, [useLocalDocument, localDocuments, localStorageKey]);

  // Only fetch from API for non-local documents
  const {
    data: apiDocuments,
    isLoading: isDocumentsFetching,
    mutate: mutateDocuments,
  } = useSWR<Array<Document>>(
    shouldFetchDocument && !useLocalDocument
      ? `/api/document?id=${actualDocumentId}`
      : null,
    fetcher,
  );

  // Use either API documents or local documents
  const documents = useLocalDocument ? localDocuments : apiDocuments;

  // Custom mutate function that works for both API and local documents
  const mutateDocumentsWrapper = useCallback(
    (
      updaterFn?: (current: Document[] | undefined) => Document[] | undefined,
    ) => {
      if (useLocalDocument) {
        if (typeof updaterFn === 'function') {
          setLocalDocuments((current) => updaterFn(current));
        }
      } else {
        mutateDocuments(updaterFn);
      }
    },
    [useLocalDocument, mutateDocuments],
  );

  const [mode, setMode] = useState<'edit' | 'diff'>('edit');
  const [document, setDocument] = useState<Document | null>(null);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);

  const { open: isSidebarOpen } = useSidebar();

  // Update current document when documents change
  useEffect(() => {
    if (documents && documents.length > 0) {
      const mostRecentDocument = documents.at(-1);

      if (mostRecentDocument) {
        setDocument(mostRecentDocument);
        setCurrentVersionIndex(documents.length - 1);
        setArtifact((currentArtifact) => ({
          ...currentArtifact,
          content: mostRecentDocument.content ?? '',
        }));
      }
    }
  }, [documents, setArtifact]);

  // No need for this effect with the unified mutate function
  useEffect(() => {
    if (!useLocalDocument) {
      mutateDocuments();
    }
  }, [artifact.status, mutateDocuments, useLocalDocument]);

  const { mutate } = useSWRConfig();
  const [isContentDirty, setIsContentDirty] = useState(false);

  const handleContentChange = useCallback(
    (updatedContent: string) => {
      if (!artifact) return;

      if (useLocalDocument) {
        // For local documents, create a new version directly
        setIsContentDirty(true);

        // Add a new version to local documents
        const currentTime = new Date();
        setLocalDocuments((currentDocuments) => {
          if (!currentDocuments) return undefined;

          const newDocument = {
            id: actualDocumentId,
            kind: artifact.kind as ArtifactKind,
            title: artifact.title,
            content: updatedContent,
            createdAt: currentTime,
            updatedAt: currentTime,
            userId: 'local-user',
          };

          // Clear dirty flag after creating new version with a longer delay for visibility
          setTimeout(() => {
            console.log('Clearing dirty flag for local document');
            setIsContentDirty(false);
            setDocument(newDocument); // Set as current document so timestamp updates
          }, 1000);

          // Log for debugging
          console.log('Created new version:', newDocument);
          console.log(
            'Total versions:',
            [...currentDocuments, newDocument].length,
          );

          return [...currentDocuments, newDocument];
        });

        // Update the current content in the artifact
        setArtifact((currentArtifact) => ({
          ...currentArtifact,
          content: updatedContent,
        }));
      } else {
        // For API documents, use the existing API-based mutation
        mutate<Array<Document>>(
          `/api/document?id=${artifact.documentId}`,
          async (currentDocuments) => {
            if (!currentDocuments) return undefined;

            const currentDocument = currentDocuments.at(-1);

            if (!currentDocument || !currentDocument.content) {
              setIsContentDirty(false);
              return currentDocuments;
            }

            if (currentDocument.content !== updatedContent) {
              await fetch(`/api/document?id=${artifact.documentId}`, {
                method: 'POST',
                body: JSON.stringify({
                  title: artifact.title,
                  content: updatedContent,
                  kind: artifact.kind,
                }),
              });

              setIsContentDirty(false);

              const newDocument = {
                ...currentDocument,
                content: updatedContent,
                createdAt: new Date(),
              };

              return [...currentDocuments, newDocument];
            }
            return currentDocuments;
          },
          { revalidate: false },
        );
      }
    },
    [
      artifact,
      mutate,
      useLocalDocument,
      actualDocumentId,
      setArtifact,
      setLocalDocuments,
    ],
  );

  const debouncedHandleContentChange = useDebounceCallback(
    handleContentChange,
    1000, // Reduced debounce time for more immediate feedback
  );

  const saveContent = useCallback(
    (updatedContent: string, debounce: boolean) => {
      // Always set dirty flag immediately to provide visual feedback
      setIsContentDirty(true);
      console.log('Content is dirty, saving...');

      if (document && updatedContent !== document.content) {
        if (debounce) {
          debouncedHandleContentChange(updatedContent);
        } else {
          handleContentChange(updatedContent);
        }
      } else {
        // If no actual change, clear dirty flag after a short delay
        setTimeout(() => setIsContentDirty(false), 500);
      }
    },
    [document, debouncedHandleContentChange, handleContentChange],
  );

  function getDocumentContentById(index: number) {
    if (!documents) return '';
    if (!documents[index]) return '';
    return documents[index].content ?? '';
  }

  const handleVersionChange = (type: 'next' | 'prev' | 'toggle' | 'latest') => {
    if (!documents) return;

    if (type === 'latest') {
      setCurrentVersionIndex(documents.length - 1);
      setMode('edit');
    }

    if (type === 'toggle') {
      setMode((mode) => (mode === 'edit' ? 'diff' : 'edit'));
    }

    if (type === 'prev') {
      if (currentVersionIndex > 0) {
        setCurrentVersionIndex((index) => index - 1);
      }
    } else if (type === 'next') {
      if (currentVersionIndex < documents.length - 1) {
        setCurrentVersionIndex((index) => index + 1);
      }
    }
  };

  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  /*
   * NOTE: if there are no documents, or if
   * the documents are being fetched, then
   * we mark it as the current version.
   */

  const isCurrentVersion =
    documents && documents.length > 0
      ? currentVersionIndex === documents.length - 1
      : true;

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  const artifactDefinition = artifactDefinitions.find(
    (definition) => definition.kind === artifact.kind,
  );

  if (!artifactDefinition) {
    throw new Error('Artifact definition not found!');
  }

  useEffect(() => {
    if (artifact.documentId !== 'init') {
      if (artifactDefinition.initialize) {
        artifactDefinition.initialize({
          documentId: artifact.documentId,
          setMetadata,
        });
      }
    }
  }, [artifact.documentId, artifactDefinition, setMetadata]);

  // Type assertions to help TypeScript understand compatibility
  const compatibleMessages = messages as any;
  const compatibleSetMessages = setMessages as any;
  const compatibleAppend = append as any;
  const compatibleReload = reload as any;

  return (
    <AnimatePresence>
      {artifact.isVisible && (
        <motion.div
          data-testid="artifact"
          className="flex flex-row h-dvh w-dvw fixed top-0 left-0 z-50 bg-transparent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.4 } }}
        >
          {!isMobile && (
            <motion.div
              className="fixed bg-background h-dvh"
              initial={{
                width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                right: 0,
              }}
              animate={{ width: windowWidth, right: 0 }}
              exit={{
                width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                right: 0,
              }}
            />
          )}

          {!isMobile && (
            <motion.div
              className="relative w-[400px] bg-muted dark:bg-background h-dvh shrink-0"
              initial={{ opacity: 0, x: 10, scale: 1 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 30,
                },
              }}
              exit={{
                opacity: 0,
                x: 0,
                scale: 1,
                transition: { duration: 0 },
              }}
            >
              <AnimatePresence>
                {!isCurrentVersion && (
                  <motion.div
                    className="left-0 absolute h-dvh w-[400px] top-0 bg-zinc-900/50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              <div className="flex flex-col h-full justify-between items-center gap-4">
                <ArtifactMessages
                  chatId={chatId}
                  status={status}
                  messages={messages as any}
                  setMessages={setMessages as any}
                  reload={reload as any}
                  isReadonly={isReadonly}
                  artifactStatus={artifact.status}
                />

                <form className="flex flex-row gap-2 relative items-end w-full px-4 pb-4">
                  <MultimodalInput
                    chatId={chatId}
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    status={status}
                    stop={stop}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    messages={messages}
                    append={append}
                    className="bg-background dark:bg-muted"
                    setMessages={setMessages}
                  />
                </form>
              </div>
            </motion.div>
          )}

          <motion.div
            className="fixed dark:bg-muted bg-background h-dvh flex flex-col overflow-y-scroll md:border-l dark:border-zinc-700 border-zinc-200"
            initial={
              isMobile
                ? {
                    opacity: 1,
                    x: artifact.boundingBox.left,
                    y: artifact.boundingBox.top,
                    height: artifact.boundingBox.height,
                    width: artifact.boundingBox.width,
                    borderRadius: 50,
                  }
                : {
                    opacity: 1,
                    x: artifact.boundingBox.left,
                    y: artifact.boundingBox.top,
                    height: artifact.boundingBox.height,
                    width: artifact.boundingBox.width,
                    borderRadius: 50,
                  }
            }
            animate={
              isMobile
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth ? windowWidth : 'calc(100dvw)',
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: 'spring',
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
                : {
                    opacity: 1,
                    x: 400,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth
                      ? windowWidth - 400
                      : 'calc(100dvw-400px)',
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: 'spring',
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
            }
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: {
                delay: 0.1,
                type: 'spring',
                stiffness: 600,
                damping: 30,
              },
            }}
          >
            <div className="p-2 flex flex-row justify-between items-start">
              <div className="flex flex-row gap-4 items-start">
                <ArtifactCloseButton />

                <div className="flex flex-col">
                  <div className="font-medium">{artifact.title}</div>

                  {isContentDirty ? (
                    <div className="text-sm text-muted-foreground">
                      Saving changes...
                    </div>
                  ) : document ? (
                    <div className="text-sm text-muted-foreground">
                      {`Updated ${formatDistance(
                        new Date(document.createdAt),
                        new Date(),
                        {
                          addSuffix: true,
                        },
                      )}`}
                    </div>
                  ) : (
                    <div className="w-32 h-3 mt-2 bg-muted-foreground/20 rounded-md animate-pulse" />
                  )}
                </div>
              </div>

              <ArtifactActions
                artifact={artifact}
                currentVersionIndex={currentVersionIndex}
                handleVersionChange={handleVersionChange}
                isCurrentVersion={isCurrentVersion}
                mode={mode}
                metadata={metadata}
                setMetadata={setMetadata}
              />
            </div>

            <div className="dark:bg-muted bg-background h-full overflow-y-scroll !max-w-full items-center">
              <artifactDefinition.content
                title={artifact.title}
                content={
                  isCurrentVersion
                    ? artifact.content
                    : getDocumentContentById(currentVersionIndex)
                }
                mode={mode}
                status={artifact.status}
                currentVersionIndex={currentVersionIndex}
                suggestions={[]}
                onSaveContent={saveContent}
                isInline={false}
                isCurrentVersion={isCurrentVersion}
                getDocumentContentById={getDocumentContentById}
                isLoading={isDocumentsFetching && !artifact.content}
                metadata={metadata}
                setMetadata={setMetadata}
              />

              <AnimatePresence>
                {isCurrentVersion && (
                  <Toolbar
                    isToolbarVisible={isToolbarVisible}
                    setIsToolbarVisible={setIsToolbarVisible}
                    status={status}
                    append={compatibleAppend}
                    stop={stop}
                    setMessages={compatibleSetMessages}
                    artifactKind={artifact.kind}
                  />
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {!isCurrentVersion && (
                <VersionFooter
                  currentVersionIndex={currentVersionIndex}
                  documents={documents}
                  handleVersionChange={handleVersionChange}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Artifact = memo(PureArtifact, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;
  if (prevProps.input !== nextProps.input) return false;
  if (!equal(prevProps.messages, nextProps.messages.length)) return false;

  return true;
});
