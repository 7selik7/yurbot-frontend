import React, { FC } from 'react';
import Markdown from 'react-markdown';

interface IMessageTypingProps {
  botResponse: string;
  isAnswerPreparing: boolean;
}

const MessageTyping: FC<IMessageTypingProps> = ({ botResponse, isAnswerPreparing }) => {
  const showTypingDots = isAnswerPreparing && botResponse.trim() === '';
  const shouldRender = isAnswerPreparing || botResponse.trim().length > 0;

  return shouldRender ? (
    <div className="flex flex-row gap-3 w-full max-w-full">
      <div className="w-[30px] h-[30px] rounded-full bg-black flex items-center justify-center flex-shrink-0">
        <span className="text-white">Y</span>
      </div>

      <div className="flex flex-col w-full">
        <div className="text-sm font-semibold mb-1 pl-[5px]">YurBot</div>

        {showTypingDots ? (
          <div className="flex items-center space-x-1 pl-[5px] h-[24px]">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        ) : (
          <Markdown>{botResponse}</Markdown>
        )}
      </div>
    </div>
  ) : null;
};

export default MessageTyping;
