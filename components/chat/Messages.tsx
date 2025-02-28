import { forwardRef } from 'react';
import { Message } from './Message';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';

const Messages = forwardRef<HTMLDivElement>(function Messages(props, ref) {
  const { conversationHistory } = useInterviewStore();
  const { isTranscribing: isAITranscribing } = useLiveAPIContext();
  const { isTranscribing: isUserTranscribing } = useInterviewStore();

  const showLoadingMessage = isAITranscribing || isUserTranscribing;
  const loadingMessageRole = isAITranscribing ? 'assistant' : 'user';

  return (
    <motion.div className="grow overflow-auto rounded-md p-4" ref={ref}>
      <motion.div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-24">
        <AnimatePresence mode="popLayout">
          {conversationHistory.map((msg) => (
            <Message
              key={msg.timestamp}
              role={msg.role}
              content={msg.content}
              isLatest={false}
            />
          ))}
          {showLoadingMessage && (
            <Message
              key="loading"
              role={loadingMessageRole}
              content=""
              isLatest={true}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;
