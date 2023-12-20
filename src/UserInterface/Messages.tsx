import React from 'react';

type PropsType = {
  messages: { id: number, message: string }[],
}

const Messages: React.FC<PropsType> = ({
  messages,
}) => (
  <div>
    {
      messages.map((m) => (
        <div key={m.id}>{m.message}</div>
      ))
    }
  </div>
)

export default Messages;
