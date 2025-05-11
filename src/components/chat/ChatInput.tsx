import React, { FC, useState } from 'react';

interface IChatInputProps {
  messageValue: string;
  attachedFiles: File[];
  isMessageRequestsLoading: boolean;
  setMessageValue: (messageValue: string) => void;
  setAttachedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleSendClick: () => void;
}

const ChatInput: FC<IChatInputProps> = ({
  messageValue,
  attachedFiles,
  isMessageRequestsLoading,
  setMessageValue,
  setAttachedFiles,
  handleSendClick,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="p-4 border-t border-gray-200 flex items-center gap-2">
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachedFiles.map((file, index) => (
            <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
              {file.name}
              <button
                onClick={() => removeFile(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <textarea
          rows={2}
          placeholder="Type your message..."
          value={messageValue}
          onChange={(e) => setMessageValue(e.target.value)}
          className="w-full resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          id="file-input"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-input"
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition"
        >
          📎
        </label>
        <button
          onClick={() => handleSendClick()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          disabled={!messageValue.trim() && attachedFiles.length === 0}
        >
          {isMessageRequestsLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
